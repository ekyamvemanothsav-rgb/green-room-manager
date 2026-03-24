const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["superadmin", "admin", "coordinator", "participant"],
        default: "participant"
    },

    // Participant-specific fields
    phoneNumber: {
        type: String,
        default: ""
    },

    collegeName: {
        type: String,
        default: ""
    },

    eventName: {
        type: String,
        default: ""
    },

    participantsCount: {
        type: Number,
        default: 1
    }

})

module.exports = mongoose.model("User", UserSchema)