const Booking = require("../models/Bookings");
const OTP = require("../models/OTP");
const Event = require("../models/Event");
const User = require("../models/User");
const { sendOtpEmail, sendBookingEmail } = require("../utils/email");

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================= SEND OTP =================
exports.sendOtpEmail = async (req, res) => {
    try {
        const otp = generateOtp();

        await OTP.deleteMany({ email: req.user.email, action: "event_booking" });

        await OTP.create({
            email: req.user.email,
            otp,
            action: "event_booking",
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        const emailSent = await sendOtpEmail(
            req.user.email,
            otp,
            "event_booking"
        );

        if (!emailSent) {
            await OTP.deleteMany({ email: req.user.email, action: "event_booking" });
            return res.status(500).json({ message: "Failed to send OTP" });
        }

        res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= BOOK EVENT =================
exports.bookEvent = async (req, res) => {
    try {
        const { eventId, otp, quantity = 1 } = req.body;

        if (!eventId || !otp) {
            return res.status(400).json({ error: "Event ID and OTP are required" });
        }

        // ✅ OTP Verification
        const otpRecord = await OTP.findOne({
            email: req.user.email,
            otp,
            action: "event_booking",
        });

        if (!otpRecord) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        if (new Date(otpRecord.expiresAt) < new Date()) {
            await OTP.deleteMany({ email: req.user.email, action: "event_booking" });
            return res.status(400).json({ error: "OTP expired" });
        }

        // 🔥 Atomic seat check ONLY (do NOT reduce yet)
        const event = await Event.findById(eventId);
        if (!event || event.availableSeats < quantity) {
            return res.status(400).json({ error: "Not enough seats available" });
        }

        // ✅ Prevent duplicate booking
        const existingBooking = await Booking.findOne({
            userId: req.user._id,
            eventId,
        });

        if (existingBooking) {
            return res.status(400).json({
                error: "You already booked this event",
            });
        }

        const amount = event.ticketPrice * quantity;

        // ✅ Create booking as PENDING
        const booking = await Booking.create({
            userId: req.user._id,
            eventId,
            quantity,
            amount,
            status: "pending",
            paymentStatus: "not_paid",
        });

        await OTP.deleteMany({ email: req.user.email, action: "event_booking" });

        res.status(201).json({
            message: "Booking created. Waiting for confirmation.",
            booking,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= CONFIRM BOOKING (Admin) =================
exports.confirmBooking = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        if (!["paid", "not_paid"].includes(paymentStatus)) {
            return res.status(400).json({ error: "Invalid payment status" });
        }

        const booking = await Booking.findById(req.params.id).populate("eventId");

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        if (booking.status === "confirmed") {
            return res.status(400).json({ error: "Already confirmed" });
        }

        if(req.user.role === "organizer" &&
            booking.eventId.createdBy.toString() != req.user._id.toString()
        ){
            return res.status(403).json({error : "Not Authorized to confirm booking"});
        }

        // 🔥 Atomic seat reduction at confirmation stage
        const event = await Event.findOneAndUpdate(
            {
                _id: booking.eventId._id,
                availableSeats: { $gte: booking.quantity },
            },
            {
                $inc: { availableSeats: -booking.quantity },
            },
            { new: true }
        );

        if (!event) {
            return res.status(400).json({
                error: "Not enough seats available",
            });
        }

        booking.status = "confirmed";
        booking.paymentStatus = paymentStatus;
        await booking.save();

        const user = await User.findById(booking.userId);
        await sendBookingEmail(user.email, user.name, event.title);

        res.status(200).json({ message: "Booking confirmed" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= GET ALL BOOKINGS =================
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("userId", "name email")
            .populate("eventId", "title totalSeats availableSeats")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= GET MY BOOKINGS =================
exports.getMyBooking = async (req, res) => {
    try {
        const bookings = await Booking.find({
            userId: req.user._id,
        }).populate("eventId");

        res.status(200).json(bookings);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= CANCEL BOOKING =================
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        if (
            booking.userId.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        if (booking.status === "confirmed") {
            // 🔥 Return seats safely
            await Event.findByIdAndUpdate(booking.eventId, {
                $inc: { availableSeats: booking.quantity },
            });
        }

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully",
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrganizerBookings = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user._id });

        const eventIds = events.map(e => e._id);

        const bookings = await Booking.find({ eventId: { $in: eventIds } })
            .populate('userId', 'name email')
            .populate('eventId', 'title');

        res.json(bookings);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};