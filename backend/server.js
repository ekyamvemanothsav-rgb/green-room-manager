const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const adminRoutes = require("./routes/admin")
const coordinatorRoutes = require("./routes/coordinator")
const participantRoutes = require("./routes/participant")
const roomRoutes = require("./routes/rooms")
const verifyToken = require("./middleware/authMiddleware")

const app = express()

// Global Log Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))

// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/coordinator", coordinatorRoutes)
app.use("/api/participant", participantRoutes)
app.use("/api/rooms", roomRoutes)

app.get("/", (req, res) => {
  res.send("Green Room Manager API Running")
})

// TEST PROTECTED ROUTE
app.get("/api/protected", verifyToken, (req, res) => {
    res.json({
        message: "Access granted",
        user: req.user
    })
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})