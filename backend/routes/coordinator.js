const express = require("express")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const verifyToken = require("../middleware/authMiddleware")

const router = express.Router()

// CREATE COORDINATOR (Only Admin)
router.post("/create-coordinator", verifyToken, async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Only Admin can create coordinators"
            })
        }

        const { name, email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const coordinator = new User({
            name,
            email,
            password: hashedPassword,
            role: "coordinator"
        })

        await coordinator.save()

        res.json({
            message: "Coordinator created successfully"
        })

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        })

    }

})

module.exports = router