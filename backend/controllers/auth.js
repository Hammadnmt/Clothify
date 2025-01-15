const crypto = require("crypto");
const { generateToken } = require("../util/generateToken");
const exceptionHandler = require("../middlewares/exceptionHandler");
const AppError = require("../util/appError");
const User = require("../models/user");
const { sendEmail, verifyEmail } = require("../config/nodemailer");
const {
  generateVerificationToken,
  createPasswordResetTemplate,
  createEmailVerificationTemplate,
} = require("../util/helper");

const sendVerificationEmail = async (user) => {
  const { token, hash } = generateVerificationToken();

  user.verificationToken = hash;
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const template = createEmailVerificationTemplate(verificationUrl);

  try {
    await sendEmail(user.email, template.subject, template.text, template.html);
    return true;
  } catch (error) {
    user.verificationToken = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(error);
    throw new AppError(
      "There was an error sending the verification email. Please try again later.",
      500
    );
  }
};

//@desc Create a account
//@route POST /api/v1/users/signup/
//@access Public
exports.signup = exceptionHandler(async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    role,
    phone,
    isActive: true,
    emailVerified: false,
  });

  await sendVerificationEmail(newUser);

  const token = generateToken(res, newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: newUser,
    message: "Please check your email to verify your account",
  });
});

//@desc Sign in to account
//@route POST /api/v1/users/signin/
//@access Public
exports.signin = exceptionHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    if (!user.emailVerified) {
      await sendVerificationEmail(user);
    }
    const token = generateToken(res, user._id);

    await User.findByIdAndUpdate(user._id, {
      isActive: true,
      lastLoginAt: Date.now(),
    });

    res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  } else {
    return next(new AppError("Invalid email or password", 400));
  }
});

//@desc Sign out of account
//@route POST /api/v1/users/signout/
//@access Public
exports.signout = exceptionHandler(async (req, res, next) => {
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });

  res.status(200).json({
    status: "success",
    message: "user signed out successfully",
  });
});

//@desc Reset password
//@route POST /api/v1/users/forgot-password/
//@access Public
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("No user found with that email address", 404));
  }

  const { token, hash } = generateVerificationToken();

  user.resetToken = hash;
  user.resetTokenExpiration = Date.now() + 3600000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const template = createPasswordResetTemplate(resetUrl);

  try {
    await sendEmail(user.email, template.subject, template.text, template.html);

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to email",
    });
  } catch (error) {
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the password reset email. Please try again later.",
        500
      )
    );
  }
};

//@desc Reset password
//@route POST /api/v1/users/reset-password/
//@access Private
exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired password reset token", 400));
  }

  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();

  // const jwtToken = generateToken(res, user._id);

  res.status(200).json({
    status: "success",
    // token: jwtToken,
    message: "Password successfully reset",
  });
};

//@desc verify Email
//@route GET /api/v1/users/verify-email/:token
//@access Private
exports.verifyEmail = exceptionHandler(async (req, res, next) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    verificationToken: hashedToken,
    emailVerified: false,
  });

  if (!user) {
    return next(new AppError("Invalid or expired verification link", 400));
  }

  user.emailVerified = true;
  user.verificationToken = undefined;
  await user.save();

  // res.redirect(`${process.env.FRONTEND_URL}/check-email`);

  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
  });
});

exports.sendEmailVerification = exceptionHandler(async (req, res, next) => {
  const user = req.user;

  await sendVerificationEmail(user);
  res.status(200).json({
    status: "success",
    message: "Verification email send successfully",
  });
});

exports.getUserRole = exceptionHandler(async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    status: "success",
    role: user.role,
  });
});
