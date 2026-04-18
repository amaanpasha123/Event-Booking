const express = require('express');
const router = express.Router();
const { bookEvent, confirmBooking, getMyBooking, cancelBooking, sendOtpEmail, getAllBookings, getOrganizerBookings } = require('../controller/bookingController');
const { protect, admin } = require('../middlewares/auth');
const authorize = require("../middlewares/role");

router.post('/send-otp', protect, sendOtpEmail);
router.post('/', protect, bookEvent);
router.put('/:id/confirm', protect, authorize("admin","organizer"), confirmBooking);//only admin
router.get('/my', protect, getMyBooking);
router.get('/all', protect, admin, getAllBookings);
router.delete('/:id', protect, cancelBooking);//only admin
router.get('/organizer', protect, authorize("organizer"), getOrganizerBookings); 

module.exports = router;