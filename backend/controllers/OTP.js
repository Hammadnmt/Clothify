const exceptionHandler = require("../middlewares/exceptionHandler");
const User = require("../models/user");
const AppError = require("../util/appError");
const { verifyOTP, sendOTP } = require("../util/OTP");

//@desc Send an otp
//@route POST /api/v1/otp/send-otp
//@access Public
exports.sendingOTP = exceptionHandler(async (req, res, next) => {
  const user = req.user;
  const { phone } = req.body;

  if (!phone) {
    return next(new AppError("Phone number is required."));
  }

  const loggedUser = await User.findById(user._id);

  if (!loggedUser) {
    return next(new AppError("User not found", 404));
  }

  if (loggedUser.phoneVerified) {
    return next(new AppError(`PH: ${phone} already verified`, 404));
  }

  const result = await sendOTP(phone);

  if (result.success) {
    return res.status(200).json({ message: result.message });
  }

  return next(new AppError(result.message));
});

//@desc verify an otp
//@route POST /api/v1/otp/verify-otp
//@access Public
exports.verifyingOTP = exceptionHandler(async (req, res, next) => {
  const user = req.user;
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return next(new AppError("Phone number and OTP are required."));
  }

  const loggedUser = await User.findById(user._id);

  if (!loggedUser) {
    return next(new AppError("User not found", 404));
  }

  if (loggedUser.phoneVerified) {
    return next(new AppError(`PH: ${phone} already verified`, 404));
  }

  const result = await verifyOTP(phone, otp);

  if (result.success) {
    loggedUser.phoneVerified = true;
    await loggedUser.save();
    return res.status(200).json({ message: result.message });
  }

  return next(new AppError(result.message));
});
