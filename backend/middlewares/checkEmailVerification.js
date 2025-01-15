const checkEmailVerification = async (req, res, next) => {
  const user = req.user;

  if (!user.emailVerified) {
    return next(
      new AppError("Please verify your email to access this feature", 403)
    );
  }

  next();
};

module.exports = checkEmailVerification;
