const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || !["admin", "coordinator"].includes(role)) {
    window.location.href = "login.html";
}

document.getElementById("roomForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const baseName = document.getElementById("baseName").value.trim();
    const count = parseInt(document.getElementById("count").value);
    const capacity = parseInt(document.getElementById("capacity").value);
    const msgDiv = document.getElementById("msg");
    const submitBtn = document.getElementById("submitBtn");
    const progressArea = document.getElementById("progressArea");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const roomList = document.getElementById("roomList");

    // Reset UI
    msgDiv.className = "hidden mt-2 text-center text-sm py-2.5 px-4 rounded-xl border font-medium";
    progressArea.classList.add("hidden");
    roomList.innerHTML = "";
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Creating rooms...`;

    try {
        const res = await fetch("http://localhost:5000/api/rooms/bulk-create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ baseName, count, capacity })
        });

        const data = await res.json();

        if (!res.ok) {
            msgDiv.className = "mt-2 text-center text-sm py-2.5 px-4 rounded-xl border font-medium bg-red-500/20 text-red-400 border-red-500/30";
            msgDiv.textContent = data.message || "Failed to create rooms";
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg> Create Rooms & Download QR Codes`;
            return;
        }

        // Show progress area
        progressArea.classList.remove("hidden");
        const rooms = data.rooms;
        const total = rooms.length;

        submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Downloading QR Codes...`;

        // Download QRs one by one with progress
        for (let i = 0; i < rooms.length; i++) {
            const room = rooms[i];
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(room.roomId)}&format=png&qzone=2`;

            // Add to visual list
            const item = document.createElement("div");
            item.id = `room-item-${i}`;
            item.className = "flex items-center gap-3 py-2 px-3 rounded-xl bg-slate-800/50 border border-slate-700/50";
            item.innerHTML = `
                <div class="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <svg class="animate-spin h-3 w-3 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                </div>
                <span class="text-sm text-slate-300 flex-1">${room.roomName}</span>
                <span class="text-xs text-slate-500" id="status-${i}">Downloading…</span>
            `;
            roomList.appendChild(item);

            try {
                // Fetch QR image as blob and trigger download
                const imgRes = await fetch(qrUrl);
                const blob = await imgRes.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `QR_${room.roomName.replace(/\s+/g, "_")}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                // Mark success
                item.querySelector(`#status-${i}`).textContent = "Downloaded ✓";
                item.querySelector(`#status-${i}`).className = "text-xs text-emerald-400 font-semibold";
                item.querySelector("div.w-6").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>`;
                item.querySelector("div.w-6").className = "w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0";
            } catch (dlErr) {
                item.querySelector(`#status-${i}`).textContent = "Failed";
                item.querySelector(`#status-${i}`).className = "text-xs text-red-400";
            }

            // Update progress bar
            const pct = Math.round(((i + 1) / total) * 100);
            progressBar.style.width = pct + "%";
            progressText.textContent = pct + "%";

            // Small delay to avoid browser blocking multiple downloads
            if (i < rooms.length - 1) {
                await new Promise(r => setTimeout(r, 400));
            }
        }

        // Final success message
        msgDiv.className = "mt-2 text-center text-sm py-2.5 px-4 rounded-xl border font-medium bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        msgDiv.textContent = `✓ ${total} rooms created! All QR codes downloaded.`;

        submitBtn.disabled = false;
        submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg> Create More Rooms`;
        document.getElementById("roomForm").reset();

    } catch (err) {
        msgDiv.className = "mt-2 text-center text-sm py-2.5 px-4 rounded-xl border font-medium bg-red-500/20 text-red-400 border-red-500/30";
        msgDiv.textContent = "Server error. Please try again.";
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg> Create Rooms & Download QR Codes`;
        console.error(err);
    }
});
