const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controller/paymentController");
const { protect } = require("../middlewares/auth");

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;