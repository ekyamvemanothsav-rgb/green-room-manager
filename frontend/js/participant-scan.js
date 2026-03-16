let html5QrcodeScanner;
let scannedRoomId = null;

const token = localStorage.getItem("token");
const role  = localStorage.getItem("role");

if (!token || role !== "participant") {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    startScanner();
});

function startScanner() {
    scannedRoomId = null;
    document.getElementById("actionButtons").classList.add("hidden");
    document.getElementById("scanStatus").classList.add("hidden");
    document.getElementById("msg").classList.add("hidden");

    html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}

async function onScanSuccess(decodedText) {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().then(async () => {
            scannedRoomId = decodedText;

            // Show loading indicator
            const statusDiv = document.getElementById("scanStatus");
            statusDiv.className = "text-center text-sm p-3 rounded-xl border mb-4 font-medium bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            statusDiv.textContent = "Checking room status…";
            statusDiv.classList.remove("hidden");

            // Query check-in status
            try {
                const res = await fetch(`http://localhost:5000/api/rooms/status/${scannedRoomId}`, {
                    headers: { "Authorization": "Bearer " + token }
                });

                if (res.ok) {
                    const data = await res.json();
                    renderActionButtons(data.isCheckedIn, data.roomName);
                } else {
                    // Room not found or error — show both buttons
                    statusDiv.className = "text-center text-sm p-3 rounded-xl border mb-4 font-medium bg-red-500/20 text-red-400 border-red-500/30";
                    statusDiv.textContent = "Could not verify room status. Try again.";
                    renderActionButtons(null, "Unknown Room");
                }
            } catch (err) {
                statusDiv.className = "text-center text-sm p-3 rounded-xl border mb-4 font-medium bg-red-500/20 text-red-400 border-red-500/30";
                statusDiv.textContent = "Server error. Check connection.";
                renderActionButtons(null, "Unknown Room");
            }

        }).catch(err => console.error("Failed to clear scanner:", err));
    }
}

function renderActionButtons(isCheckedIn, roomName) {
    const statusDiv  = document.getElementById("scanStatus");
    const actionDiv  = document.getElementById("actionButtons");
    const roomLabel  = document.getElementById("scannedRoomLabel");
    const checkInBtn = document.getElementById("checkInBtn");
    const checkOutBtn= document.getElementById("checkOutBtn");

    roomLabel.textContent = `Room: ${roomName}`;

    if (isCheckedIn === true) {
        // Already in → show Check Out only
        statusDiv.className = "text-center text-sm p-3 rounded-xl border mb-4 font-medium bg-blue-500/20 text-blue-400 border-blue-500/30";
        statusDiv.textContent = `You are currently checked in to "${roomName}"`;
        checkInBtn.classList.add("hidden");
        checkOutBtn.classList.remove("hidden");
    } else if (isCheckedIn === false) {
        // Not in → show Check In only
        statusDiv.className = "text-center text-sm p-3 rounded-xl border mb-4 font-medium bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        statusDiv.textContent = `QR scanned for "${roomName}". Ready to check in.`;
        checkInBtn.classList.remove("hidden");
        checkOutBtn.classList.add("hidden");
    } else {
        // Unknown — show both
        statusDiv.className = "text-center text-sm p-3 rounded-xl border mb-4 font-medium bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        statusDiv.textContent = `Scanned "${roomName}". Choose an action.`;
        checkInBtn.classList.remove("hidden");
        checkOutBtn.classList.remove("hidden");
    }

    actionDiv.classList.remove("hidden");
}

function onScanFailure(error) {
    // Keep scanning silently
}

function resetScanner() {
    startScanner();
}

async function handleCheckIn() {
    if (!scannedRoomId) return;
    performAction("checkin");
}

async function handleCheckOut() {
    if (!scannedRoomId) return;
    performAction("checkout");
}

async function performAction(action) {
    const msgDiv     = document.getElementById("msg");
    const actionDiv  = document.getElementById("actionButtons");
    const statusDiv  = document.getElementById("scanStatus");

    Array.from(actionDiv.querySelectorAll("button")).forEach(b => b.disabled = true);

    msgDiv.className = "text-center text-sm p-3 rounded-xl border mb-4 font-medium bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    msgDiv.textContent = action === "checkin" ? "Checking in…" : "Checking out…";
    msgDiv.classList.remove("hidden");

    try {
        const res = await fetch(`http://localhost:5000/api/rooms/${action}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ roomId: scannedRoomId })
        });

        const data = await res.json();

        if (res.ok) {
            msgDiv.className = "text-center text-sm p-3 rounded-xl border mb-4 font-medium bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            msgDiv.textContent = `✓ ${data.message}`;
            actionDiv.classList.add("hidden");
            statusDiv.classList.add("hidden");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 2000);
        } else {
            msgDiv.className = "text-center text-sm p-3 rounded-xl border mb-4 font-medium bg-red-500/20 text-red-400 border-red-500/30";
            msgDiv.textContent = data.message || `Failed to ${action}`;
            Array.from(actionDiv.querySelectorAll("button")).forEach(b => b.disabled = false);
        }
    } catch (err) {
        msgDiv.className = "text-center text-sm p-3 rounded-xl border mb-4 font-medium bg-red-500/20 text-red-400 border-red-500/30";
        msgDiv.textContent = "Server error. Please try again.";
        Array.from(actionDiv.querySelectorAll("button")).forEach(b => b.disabled = false);
        console.error(err);
    }
}
