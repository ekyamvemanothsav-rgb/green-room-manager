const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ROUTES
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const coordinatorRoutes = require("./routes/coordinator");
const participantRoutes = require("./routes/participant");
const roomRoutes = require("./routes/rooms");

// MIDDLEWARE
const verifyToken = require("./middleware/authMiddleware");

const app = express();

/* ---------------- GLOBAL MIDDLEWARE ---------------- */

// Request logger
app.use((req, res, next) => {
console.log(`${req.method} ${req.url}`);
next();
});

// CORS
app.use(cors({
origin: "*",
methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parser
app.use(express.json());

/* ---------------- DATABASE CONNECTION ---------------- */

mongoose.connect(process.env.MONGO_URI)
.then(() => {
console.log("MongoDB Connected");
})
.catch((err) => {
console.error("MongoDB connection error:", err);
});

/* ---------------- ROUTES ---------------- */

// Authentication routes
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Coordinator routes
app.use("/api/coordinator", coordinatorRoutes);

// Participant routes
app.use("/api/participant", participantRoutes);

// Room routes
app.use("/api/rooms", roomRoutes);

/* ---------------- BASIC ROUTES ---------------- */

// Home route
app.get("/", (req, res) => {
res.send("Green Room Manager API Running");
});

// Health check (useful for Render)
app.get("/health", (req, res) => {
res.status(200).send("Server is healthy");
});

// Test protected route
app.get("/api/protected", verifyToken, (req, res) => {
res.json({
message: "Access granted",
user: req.user
});
});

/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
