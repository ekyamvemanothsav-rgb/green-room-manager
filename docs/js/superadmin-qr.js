const token = localStorage.getItem("token");
const role  = localStorage.getItem("role");

if (!token || role !== "superadmin") {
    window.location.href = "login.html";
}

let allRooms = [];

async function loadRooms() {
    try {
        const res = await fetch(`${window.CONFIG.API_URL}/api/rooms/all`);
        if (!res.ok) throw new Error("Failed to fetch rooms");
        allRooms = await res.json();

        document.getElementById("loadingState").classList.add("hidden");

        if (allRooms.length === 0) {
            document.getElementById("emptyState").classList.remove("hidden");
            return;
        }

        // Update count badge
        const countBadge = document.getElementById("roomCount");
        countBadge.textContent = `${allRooms.length} Room${allRooms.length !== 1 ? "s" : ""}`;
        countBadge.classList.remove("hidden");

        // Render grid
        const grid = document.getElementById("qrGrid");
        grid.classList.remove("hidden");
        grid.innerHTML = "";

        allRooms.forEach((room, idx) => {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(room.roomId)}&format=png&qzone=2`;
            const card = document.createElement("div");
            card.className = "glass-card rounded-2xl border border-white/5 p-4 flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform duration-300";
            card.innerHTML = `
                <div class="bg-white rounded-xl p-2 shadow-lg w-full aspect-square flex items-center justify-center">
                    <img src="${qrUrl}" alt="QR for ${room.roomName}" class="w-full h-full object-contain rounded-lg" loading="lazy">
                </div>
                <p class="text-sm font-semibold text-white text-center leading-tight">${room.roomName}</p>
                <button
                    onclick="downloadSingleQR('${room.roomId}', '${room.roomName.replace(/'/g, "\\'")}')"
                    class="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold border border-purple-500/30 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                </button>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        document.getElementById("loadingState").innerHTML = `
            <p class="text-red-400 text-center">Failed to load rooms. Is the backend running?</p>
        `;
        console.error(err);
    }
}

async function downloadSingleQR(roomId, roomName) {
    try {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(roomId)}&format=png&qzone=2`;
        const res = await fetch(qrUrl);
        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = `QR_${roomName.replace(/\s+/g, "_")}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Download failed:", err);
    }
}

window.downloadAllQRs = async function() {
    if (allRooms.length === 0) return;

    const btn        = document.getElementById("downloadAllBtn");
    const bulkStatus = document.getElementById("bulkStatus");
    const bulkBar    = document.getElementById("bulkBar");
    const bulkPct    = document.getElementById("bulkPercent");

    btn.disabled = true;
    btn.classList.add("opacity-60", "cursor-not-allowed");
    bulkStatus.classList.remove("hidden");

    for (let i = 0; i < allRooms.length; i++) {
        const room = allRooms[i];
        await downloadSingleQR(room.roomId, room.roomName);

        const pct = Math.round(((i + 1) / allRooms.length) * 100);
        bulkBar.style.width = pct + "%";
        bulkPct.textContent = pct + "%";

        // Small delay to prevent browser from blocking repeated downloads
        if (i < allRooms.length - 1) {
            await new Promise(r => setTimeout(r, 450));
        }
    }

    // Done
    bulkStatus.innerHTML = `
        <p class="text-center text-sm text-emerald-400 font-semibold py-1">
            ✓ All ${allRooms.length} QR codes downloaded successfully!
        </p>
    `;
    btn.disabled = false;
    btn.classList.remove("opacity-60", "cursor-not-allowed");
};

loadRooms();
