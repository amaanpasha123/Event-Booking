const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    amount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },

    paymentStatus: {
        type: String,
        enum: ["not_paid", "paid"],
        default: "not_paid"
    },

    // 🔥 snapshot (important)
    eventTitle: String,
    eventDate: Date

}, { timestamps: true });

// 🔥 prevent duplicate spam bookings
bookingSchema.index({ userId: 1, eventId: 1 });

module.exports = mongoose.model("Booking", bookingSchema);