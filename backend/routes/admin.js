const express = require("express")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const verifyToken = require("../middleware/authMiddleware")

const router = express.Router()

// CREATE ADMIN (Only Super Admin)
router.post("/create-admin", verifyToken, async (req, res) => {

    try {

        // Check role
        if (req.user.role !== "superadmin") {
            return res.status(403).json({
                message: "Access denied. Only Super Admin can create Admin."
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

        const newAdmin = new User({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        })

        await newAdmin.save()

        res.json({
            message: "Admin created successfully"
        })

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        })

    }

})

module.exports = router