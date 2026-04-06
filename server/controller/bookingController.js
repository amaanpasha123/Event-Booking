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

        // ✅ Delete old OTP first
        await OTP.deleteMany({ email: req.user.email, action: 'event_booking' });

        // ✅ Create new OTP with expiresAt (was missing before)
        await OTP.create({
            email: req.user.email,
            otp,
            action: 'event_booking',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        const emailSent = await sendOtpEmail(req.user.email, otp, 'event_booking');

        if (!emailSent) {
            await OTP.deleteMany({ email: req.user.email, action: 'event_booking' });
            return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
        }

        res.status(200).json({ message: 'OTP sent successfully' });

    } catch (error) {
        console.error("Send OTP Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ================= BOOK EVENT =================
exports.bookEvent = async (req, res) => {
    try {
        const { eventId, otp } = req.body;

        // ✅ Validate input
        if (!eventId || !otp) {
            return res.status(400).json({ error: 'Event ID and OTP are required' });
        }

        // ✅ Find OTP record
        const otpRecord = await OTP.findOne({
            email: req.user.email,
            otp,
            action: 'event_booking'
        });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // ✅ Check OTP expiry (was missing before)
        if (new Date(otpRecord.expiresAt) < new Date()) {
            await OTP.deleteMany({ email: req.user.email, action: 'event_booking' });
            return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
        }

        // ✅ Find event — was Event.findOne(eventId) which is wrong
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // ✅ Check seats
        if (event.availableSeats <= 0) {
            return res.status(400).json({ error: 'No seats are available' });
        }

        // ✅ Check existing booking
        const existingBooking = await Booking.findOne({
            userId: req.user._id,
            eventId
        });
        if (existingBooking) {
            return res.status(400).json({ error: 'You have already registered for this event' });
        }

        // ✅ Create booking
        const booking = await Booking.create({
            userId: req.user._id,
            eventId,
            status: 'pending',
            paymentStatus: 'not_paid',
            amount: event.ticketPrice
        });

        // ✅ Delete OTP after successful booking
        await OTP.deleteMany({ email: req.user.email, action: 'event_booking' });

        res.status(201).json({
            message: 'Booking created. Awaiting admin confirmation.',
            booking
        });

    } catch (error) {
        console.error("Book Event Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ================= CONFIRM BOOKING (Admin) =================
exports.confirmBooking = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        if (!['paid', 'not_paid'].includes(paymentStatus)) {
            return res.status(400).json({ error: 'Invalid payment status' });
        }

        const booking = await Booking.findById(req.params.id).populate('eventId');
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.status === 'confirmed') {
            return res.status(400).json({ error: 'Already confirmed' });
        }

        const event = await Event.findById(booking.eventId._id);
        if (event.availableSeats <= 0) {
            return res.status(400).json({ error: 'No seats available' });
        }

        booking.status = 'confirmed';
        booking.paymentStatus = paymentStatus;
        await booking.save();

        event.availableSeats -= 1;
        await event.save();

        // ✅ Get user to pass name to email — was missing userName before
        const user = await User.findById(booking.userId);
        await sendBookingEmail(user.email, user.name, event.title);

        res.status(200).json({ message: 'Booking confirmed' });

    } catch (error) {
        console.error("Confirm Booking Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ================= GET ALL BOOKINGS (Admin) =================
exports.getAllBookings = async (req, res) => {
    try {
        // 🔍 Check if function is being called
        console.log("=== GET ALL BOOKINGS ===");
        console.log("User role:", req.user.role);

        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('eventId', 'title totalSeats availableSeats')
            .sort({ createdAt: -1 });

        // 🔍 Check what's coming from DB
        console.log("Total bookings found:", bookings.length);
        console.log("Bookings:", JSON.stringify(bookings, null, 2));

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Get All Bookings Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};


// ================= GET MY BOOKINGS =================
exports.getMyBooking = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('eventId');
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Get Bookings Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ================= CANCEL BOOKING =================
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (booking.status === 'confirmed') {
            const event = await Event.findById(booking.eventId);
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }
        

        await booking.deleteOne();

        res.status(200).json({ message: 'Booking cancelled successfully' });

    } catch (error) {
        console.error("Cancel Booking Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};