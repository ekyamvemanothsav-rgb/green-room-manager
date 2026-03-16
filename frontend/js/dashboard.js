const role = localStorage.getItem("role")

if(!role) {
    window.location.href="login.html";
}

// Display role in UI
const roleDisplay = document.getElementById("userRoleDisplay");
if(roleDisplay) {
    roleDisplay.textContent = role;
    roleDisplay.classList.remove("hidden");
}

const menu = document.getElementById("menu")

const btnClass = "px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5";

if(role === "superadmin"){
    menu.innerHTML = `
    <button onclick="goAdmin()" class="${btnClass} bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 hover:shadow-purple-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        Create Admin
    </button>
    <button onclick="goQRPanel()" class="${btnClass} bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 hover:shadow-indigo-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
        QR Codes
    </button>
    `
} else if(role === "admin"){
    menu.innerHTML = `
    <button onclick="goCoordinator()" class="${btnClass} bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 hover:shadow-blue-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        Create Coordinator
    </button>
    <button onclick="goRoom()" class="${btnClass} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 hover:shadow-emerald-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        Create Room
    </button>
    `
} else if(role === "coordinator"){
    menu.innerHTML = `
    <button onclick="goParticipant()" class="${btnClass} bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 hover:shadow-orange-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
        Add Participant
    </button>
    <button onclick="goRoom()" class="${btnClass} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 hover:shadow-emerald-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        Create Rooms
    </button>
    <button onclick="goManageRoom()" class="${btnClass} bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:shadow-red-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        Manage Room
    </button>
    `
} else if(role === "participant"){
    menu.innerHTML = `
    <button onclick="goScanQR()" class="${btnClass} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 hover:shadow-yellow-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
        Scan QR Code
    </button>
    `
} else {
    document.getElementById("menuEmpty").textContent = "No quick actions available for your role.";
}

function goAdmin()      { window.location.href="admin.html" }
function goCoordinator(){ window.location.href="coordinator.html" }
function goParticipant(){ window.location.href="participant.html" }
function goRoom()       { window.location.href="room.html" }
function goScanQR()     { window.location.href="participant-scan.html" }
function goQRPanel()    { window.location.href="superadmin-qr.html" }
function goManageRoom() { window.location.href="manage-room.html" }

function logout(){
    localStorage.clear()
    window.location.href="login.html"
}

async function loadRooms(){
    try {
        const res = await fetch("http://localhost:5000/api/rooms/all")
        if(!res.ok) throw new Error("Failed to fetch")
        const rooms = await res.json()

        const container = document.getElementById("rooms")
        container.innerHTML=""

        if (rooms.length === 0) {
            container.innerHTML = `<div class="col-span-full py-12 text-center text-slate-500 glass-card rounded-2xl border border-white/5">No rooms available currently.</div>`;
            return;
        }

        rooms.forEach((room, index) => {
            const div = document.createElement("div")
            div.className = `glass-card p-6 rounded-2xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 flex flex-col h-full animate-fade-in-up animation-delay-${(index%5)*100}`;

            const percent = room.capacity > 0 ? Math.round((room.occupied / room.capacity) * 100) : 0;
            const barColor = percent >= 90 ? 'bg-red-500' : (percent >= 75 ? 'bg-orange-500' : 'bg-primary');

            // Edit button (admin, coordinator, or superadmin)
            const showEditBtn = ["admin", "coordinator", "superadmin"].includes(role) ? `
                <button onclick="openEditRoomModal('${room.roomId}', '${room.roomName.replace(/'/g,"\\'")}', ${room.capacity})"
                    class="mt-2 px-3 py-1 bg-primary/10 border border-primary/30 hover:bg-primary/30 rounded-lg text-xs font-semibold text-primary transition-colors flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit
                </button>
            ` : '';

            // Delete button (admin or superadmin)
            const showDeleteBtn = ["admin", "superadmin"].includes(role) ? `
                <button onclick="deleteRoom('${room.roomId}', '${room.roomName.replace(/'/g,"\\'")}')"
                    class="mt-2 ml-1 px-3 py-1 bg-red-500/15 border border-red-500/30 hover:bg-red-500/30 rounded-lg text-xs font-semibold text-red-400 transition-colors flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete
                </button>
            ` : '';

            const showQRBtn = ["admin", "coordinator", "superadmin"].includes(role) ? `
                <button onclick="showRoomQR('${room.roomId}', '${room.roomName.replace(/'/g,"\\'")}')" class="mt-2 px-3 py-1 bg-slate-700/50 border border-slate-600 hover:bg-slate-600 rounded-lg text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                    QR Code
                </button>
            ` : '';

            div.innerHTML=`
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-white">${room.roomName}</h3>
                        <div class="flex flex-wrap gap-1 mt-1">${showQRBtn}${showEditBtn}${showDeleteBtn}</div>
                    </div>
                    <span class="px-2 py-1 bg-slate-800 rounded text-xs font-semibold ${percent >= 90 ? 'text-red-400' : 'text-slate-300'}">${percent}% Full</span>
                </div>

                <div class="mb-4 flex-grow">
                    <div class="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                        <div class="${barColor} h-2 rounded-full transition-all duration-1000" style="width: ${Math.min(percent, 100)}%"></div>
                    </div>
                    <div class="flex justify-between text-xs text-slate-400">
                        <span>${room.occupied} Occupied</span>
                        <span>Capacity: ${room.capacity}</span>
                    </div>
                </div>

                <div class="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-300">Available Slots</span>
                    <span class="text-lg font-bold ${room.available > 0 ? 'text-primary' : 'text-red-400'}">${room.available}</span>
                </div>
            `
            container.appendChild(div)
        })
    } catch(err) {
        console.error("Error loading rooms:", err);
    }
}

if (role !== "participant") {
    loadRooms()
    setInterval(loadRooms, 5000)
} else {
    // Hide rooms section for participants
    const roomsSection = document.getElementById("roomsSection");
    if (roomsSection) roomsSection.classList.add("hidden");
}

// Track current QR room id for download
let currentQRRoomId = null;
let currentQRRoomName = null;

window.showRoomQR = function(roomId, roomName) {
    currentQRRoomId   = roomId;
    currentQRRoomName = roomName;
    document.getElementById("qrRoomName").textContent = roomName;
    document.getElementById("qrImage").src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(roomId)}&qzone=2`;
    document.getElementById("qrModal").classList.remove("hidden");
};

window.closeQRModal = function() {
    document.getElementById("qrModal").classList.add("hidden");
};

window.downloadQRFromModal = async function() {
    if (!currentQRRoomId) return;
    try {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentQRRoomId)}&format=png&qzone=2`;
        const res  = await fetch(qrUrl);
        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = `QR_${currentQRRoomName.replace(/\s+/g, "_")}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch(e) {
        console.error("QR download error:", e);
    }
};

window.deleteRoom = async function(roomId, roomName) {
    if (!confirm(`Are you sure you want to delete room "${roomName}"? This cannot be undone.`)) return;

    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            loadRooms(); // Refresh the list
        } else {
            alert(data.message || "Failed to delete room");
        }
    } catch (err) {
        console.error("Error deleting room:", err);
        alert("Server error. Please try again.");
    }
};

// Edit Room Functions
window.openEditRoomModal = function(roomId, name, capacity) {
    document.getElementById("editRoomId").value = roomId;
    document.getElementById("editRoomName").value = name;
    document.getElementById("editRoomCapacity").value = capacity;
    document.getElementById("editRoomModal").classList.remove("hidden");
};

window.closeEditRoomModal = function() {
    document.getElementById("editRoomModal").classList.add("hidden");
};

window.saveRoomEdit = async function(e) {
    if(e) e.preventDefault();
    
    const roomId = document.getElementById("editRoomId").value;
    const roomName = document.getElementById("editRoomName").value.trim();
    const capacity = parseInt(document.getElementById("editRoomCapacity").value);
    const saveBtn = document.getElementById("saveEditBtn");

    if(!roomName || isNaN(capacity)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    try {
        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";
        
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:5000/api/rooms/${roomId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ roomName, capacity })
        });

        const data = await res.json();
        if (res.ok) {
            alert("Room updated successfully!");
            closeEditRoomModal();
            loadRooms(); // Refresh the grid
        } else {
            alert(data.message || "Failed to update room");
        }
    } catch (err) {
        console.error("Error updating room:", err);
        alert("Server error. Please try again.");
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save Changes";
    }
};