const express = require("express")
const bcrypt  = require("bcryptjs")
const jwt     = require("jsonwebtoken")
const User    = require("../models/User")

const router = express.Router()

// PARTICIPANT SELF-REGISTRATION (no auth needed)
router.post("/participant-register", async (req, res) => {
    try {
        const { name, email, phoneNumber, collegeName, eventName, participantsCount, password } = req.body

        if (!name || !email || !phoneNumber || !collegeName || !password) {
            return res.status(400).json({ message: "Name, email, phone number, college name and password are required" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "A participant with this email is already registered" })
        }

        // Hash the user-provided password
        const hashedPassword = await bcrypt.hash(password, 10)

        const participant = new User({
            name,
            email,
            password: hashedPassword,
            role: "participant",
            phoneNumber,
            collegeName,
            eventName: eventName || "",
            participantsCount: participantsCount || 1
        })

        await participant.save()

        // Auto-login: issue JWT immediately
        const token = jwt.sign(
            { id: participant._id, role: "participant" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.status(201).json({
            message: "Registration successful!",
            token,
            user: {
                id: participant._id,
                name: participant.name,
                phoneNumber: participant.phoneNumber,
                collegeName: participant.collegeName,
                eventName: participant.eventName,
                participantsCount: participant.participantsCount,
                role: "participant"
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

// STAFF LOGIN (email + password)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "User not found" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid password" })

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber || "",
                collegeName: user.collegeName || "",
                eventName: user.eventName || "",
                participantsCount: user.participantsCount || 1
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

// GENERIC REGISTER (kept for admin use)
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: "User already exists" })

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({ name, email, password: hashedPassword, role })
        await newUser.save()

        res.status(200).json({ message: "User registered successfully" })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

// GET CURRENT USER DETAILS
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if (!user) return res.status(404).json({ message: "User not found" })
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

module.exports = router
