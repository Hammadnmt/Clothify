const checkPhoneVerification = async (req, res, next) => {
  const user = req.user;

  if (!user.phoneVerified) {
    return next(
      new AppError(
        "Please verify your Phone Number to access this feature",
        403
      )
    );
  }

  next();
};

module.exports = checkPhoneVerification;
