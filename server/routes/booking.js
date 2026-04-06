const express = require('express');
const router = express.Router();
const { bookEvent, confirmBooking, getMyBooking, cancelBooking, sendOtpEmail, getAllBookings } = require('../controller/bookingController');
const { protect, admin } = require('../middlewares/auth');

router.post('/send-otp', protect, sendOtpEmail);
router.post('/', protect, bookEvent);
router.put('/:id/confirm', protect, admin, confirmBooking);//only admin
router.get('/my', protect, getMyBooking);
router.get('/all', protect, admin, getAllBookings);
router.delete('/:id', protect, cancelBooking);//only admin 

module.exports = router;