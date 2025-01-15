const express = require("express");
const exceptionHandler = require("../middlewares/exceptionHandler");
const AppError = require("../util/appError");
const router = express.Router();

router.route("/verify-captcha").post(
  exceptionHandler(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
      return next(new AppError("Token is required", 400));
    }

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
          response: token,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({
        success: true,
        message: "Captcha verified successfully",
      });
    } else {
      return next(new AppError("Captcha verification failed", "400"));
    }
  })
);

module.exports = router;
