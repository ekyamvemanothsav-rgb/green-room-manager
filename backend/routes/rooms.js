const express = require("express")
const Room = require("../models/Room")
const verifyToken = require("../middleware/authMiddleware")

const router = express.Router()

// CREATE SINGLE ROOM (Admin or Coordinator)
router.post("/create", verifyToken, async (req, res) => {
    try {
        if (!["admin", "coordinator"].includes(req.user.role)) {
            return res.status(403).json({ message: "Only Admin or Coordinator can create rooms" })
        }

        const { roomName, capacity } = req.body
        const room = new Room({ roomName, capacity })
        await room.save()

        res.json({ message: "Room created successfully", roomId: room._id, roomName: room.roomName })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

// BULK CREATE ROOMS (Admin or Coordinator)
router.post("/bulk-create", verifyToken, async (req, res) => {
    try {
        if (!["admin", "coordinator"].includes(req.user.role)) {
            return res.status(403).json({ message: "Only Admin or Coordinator can create rooms" })
        }

        const { baseName, count, capacity } = req.body

        if (!baseName || !count || !capacity) {
            return res.status(400).json({ message: "baseName, count and capacity are required" })
        }

        if (count < 1 || count > 50) {
            return res.status(400).json({ message: "count must be between 1 and 50" })
        }

        const createdRooms = []

        for (let i = 1; i <= count; i++) {
            const roomName = `${baseName} ${i}`
            const room = new Room({ roomName, capacity })
            await room.save()
            createdRooms.push({ roomId: room._id, roomName: room.roomName })
        }

        res.json({ message: `${count} rooms created successfully`, rooms: createdRooms })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

// GET ALL ROOMS WITH PARTICIPANTS
router.get("/all", async (req, res) => {
    try {
        const rooms = await Room.find().populate("participants", "name email")

        const formattedRooms = rooms.map(room => ({
            roomId: room._id,
            roomName: room.roomName,
            capacity: room.capacity,
            occupied: room.participants.length,
            available: room.capacity - room.participants.length,
            participants: room.participants
        }))

        res.json(formattedRooms)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

// GET ALL ROOMS FOR QR PANEL (superadmin)
router.get("/qr-all", async (req, res) => {
    try {
        const rooms = await Room.find({}, "roomName _id")
        const result = rooms.map(r => ({ roomId: r._id, roomName: r.roomName }))
        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

// PARTICIPANT CHECK-IN BY QR
router.post("/checkin", verifyToken, async (req, res) => {
    try {
        const { roomId } = req.body
        const participantId = req.user.id

        const room = await Room.findById(roomId)
        if (!room) return res.status(404).json({ message: "Room not found" })

        if (room.participants.includes(participantId)) {
            return res.json({ message: "Already checked in", alreadyIn: true })
        }

        if (room.participants.length >= room.capacity) {
            return res.status(400).json({ message: "Room is full" })
        }

        room.participants.push(participantId)
        await room.save()

        res.json({ message: "Check-in successful" })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
})

// PARTICIPANT CHECK-OUT BY QR
router.post("/checkout", verifyToken, async (req, res) => {
    try {
        const { roomId } = req.body
        const participantId = req.user.id

        const room = await Room.findById(roomId)
        if (!room) return res.status(404).json({ message: "Room not found" })

        if (!room.participants.map(id => id.toString()).includes(participantId)) {
            return res.status(400).json({ message: "Not checked in to this room" })
        }

        room.participants = room.participants.filter(id => id.toString() !== participantId)
        await room.save()

        res.json({ message: "Check-out successful" })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
})

// CHECK STATUS — is participant in a given room?
router.get("/status/:roomId", verifyToken, async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId)
        if (!room) return res.status(404).json({ message: "Room not found" })

        const participantId = req.user.id
        const isCheckedIn = room.participants.map(id => id.toString()).includes(participantId)

        res.json({ roomName: room.roomName, isCheckedIn })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
})

// ASSIGN PARTICIPANT TO ROOM (admin/coordinator)
router.post("/assign", verifyToken, async (req, res) => {
    try {
        const { participantId, roomId } = req.body
        const room = await Room.findById(roomId)

        if (!room) return res.status(404).json({ message: "Room not found" })
        if (room.participants.length >= room.capacity) return res.status(400).json({ message: "Room is full" })

        room.participants.push(participantId)
        await room.save()

        res.json({ message: "Participant assigned to room successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

// COORDINATOR FORCE-CHECKOUT a participant from a room
router.post("/force-checkout", verifyToken, async (req, res) => {
    try {
        if (!['admin', 'coordinator'].includes(req.user.role)) {
            return res.status(403).json({ message: "Only coordinators or admins can force-checkout participants" })
        }

        const { roomId, participantId } = req.body
        if (!roomId || !participantId) {
            return res.status(400).json({ message: "roomId and participantId are required" })
        }

        const room = await Room.findById(roomId)
        if (!room) return res.status(404).json({ message: "Room not found" })

        const wasIn = room.participants.map(id => id.toString()).includes(participantId)
        if (!wasIn) return res.status(400).json({ message: "Participant is not in this room" })

        room.participants = room.participants.filter(id => id.toString() !== participantId)
        await room.save()

        res.json({ message: "Participant checked out successfully" })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
})

// GET ROOM WITH FULL PARTICIPANT DETAILS (for coordinator manage view)
router.get("/details/:roomId", verifyToken, async (req, res) => {
    console.log(`GET /details/${req.params.roomId} - Role: ${req.user.role}`);
    try {
        if (!['admin', 'coordinator', 'superadmin'].includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" })
        }

        const room = await Room.findById(req.params.roomId)
            .populate("participants", "name phoneNumber collegeName email")

        if (!room) return res.status(404).json({ message: "Room not found" })

        res.json({
            roomId: room._id,
            roomName: room.roomName,
            capacity: room.capacity,
            participants: room.participants
        })
    } catch (err) {
        console.error("Error in /details/:roomId:", err);
        res.status(500).json({ message: "Server error", error: err.message })
    }
})

// UPDATE ROOM (admin, coordinator, or superadmin)
router.put("/:roomId", verifyToken, async (req, res) => {
    try {
        if (!["admin", "coordinator", "superadmin"].includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" })
        }

        const { roomName, capacity } = req.body
        const room = await Room.findById(req.params.roomId)

        if (!room) return res.status(404).json({ message: "Room not found" })

        if (roomName) room.roomName = roomName
        if (capacity !== undefined) room.capacity = capacity

        await room.save()

        res.json({ message: "Room updated successfully", room })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
})

// DELETE ROOM (admin or superadmin)
router.delete("/:roomId", verifyToken, async (req, res) => {
    try {
        if (!["admin", "superadmin"].includes(req.user.role)) {
            return res.status(403).json({ message: "Only Admin or Super Admin can delete rooms" })
        }

        const room = await Room.findByIdAndDelete(req.params.roomId)
        if (!room) return res.status(404).json({ message: "Room not found" })

        res.json({ message: `Room "${room.roomName}" deleted successfully` })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
})

module.exports = router
