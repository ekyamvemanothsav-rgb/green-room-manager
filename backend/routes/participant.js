const express = require("express")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const verifyToken = require("../middleware/authMiddleware")

const router = express.Router()

// CREATE PARTICIPANT (Only Coordinator)
router.post("/create-participant", verifyToken, async (req, res) => {

    try {

        if (req.user.role !== "coordinator") {
            return res.status(403).json({
                message: "Only Coordinators can create participants"
            })
        }

        const { name, email, password, collegeName, eventName, participantsCount } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const participant = new User({
            name,
            email,
            password: hashedPassword,
            role: "participant",
            collegeName: collegeName || "",
            eventName: eventName || "",
            participantsCount: participantsCount || 1
        })

        await participant.save()

        res.json({
            message: "Participant created successfully"
        })

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        })

    }

})

module.exports = router