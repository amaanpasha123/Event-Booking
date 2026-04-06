const mongoose = require("mongoose");

const otpModel = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ["account_verification", "event_booking"], // ✅ fixed typo: was "enem"
    },
    expiresAt: {
        type: Date,        // ✅ this field was completely missing
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300       // ✅ keep this — auto deletes document after 5 min
    }
});

module.exports = mongoose.model("OTP", otpModel);