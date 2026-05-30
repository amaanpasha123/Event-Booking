const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth');  // 👈 match your folder name "middlewares"
const {
    getPendingOrganizers,
    approveOrganizer,
    rejectOrganizer,
    getAllOrganizers,
    getAllUsers
} = require('../controller/adminController');  // 👈 match your folder name "controller"

router.use(protect, admin);

router.get('/pending-organizers',  getPendingOrganizers);
router.patch('/approve-organizer/:userId',  approveOrganizer);
router.patch('/reject-organizer/:userId', rejectOrganizer);
router.get('/organizers',  getAllOrganizers);
router.get('/users', getAllUsers);

module.exports = router;

