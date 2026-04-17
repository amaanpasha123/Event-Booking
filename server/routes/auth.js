const express = require("express");
const router = express.Router();
const {registerUser,registerOrganizer, loginUser, verifyOtp} = require("../controller/authController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyOtp);
router.post("/register-organizer", registerOrganizer);


module.exports = router;