const express = require("express");
const { sendingOTP, verifyingOTP } = require("../controllers/OTP");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/send-otp").post(protect, sendingOTP);

router.route("/verify-otp").post(protect, verifyingOTP);

module.exports = router;
