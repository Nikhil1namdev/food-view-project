const mongoose = require('mongoose');

// =========================================================================
// HIGH-FIDELITY USER SCHEMA (user.model.js)
// =========================================================================
// Stores standard customers, contact emails, hashed passwords, and support
// for single sign-on (SSO) OAuth integrations (Google & GitHub).
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        // Optional for users registering via third-party SSO OAuth
    },
    authProvider: {
        type: String,
        enum: ["local", "google", "github"],
        default: "local"
    },
    providerId: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: ""
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: true
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;