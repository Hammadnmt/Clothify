const express = require("express");

const {
  getAll,
  getOne,
  deleteOne,
  updateOne,
  create,
  updatePhone,
  getMine,
  updateAddress,
  deleteAddress,
  updateMine,
} = require("../controllers/user");
const {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendEmailVerification,
  getUserRole,
} = require("../controllers/auth");

const { userValidator } = require("../validators/user");

const checkValidation = require("../middlewares/checkValidation");
const { checkAccess, protect, checkSignin } = require("../middlewares/auth");
const checkObjectId = require("../middlewares/checkObjectId");
const { upload } = require("../middlewares/upload");

const router = express.Router();

if (process.env.NODE_ENV === "test") {
  router.route("/signup").post(signup);
  router.route("/signin").post(signin);
} else {
  router.route("/signup").post(checkSignin, signup);
  router.route("/signin").post(checkSignin, signin);
  router.route("/signout").post(signout);
  router.route("/role").get(protect, checkAccess, getUserRole);

  router.route("/send-email").get(protect, sendEmailVerification);

  router.route("/mine").get(protect, getMine).patch(protect, updateMine);

  router.route("/change-phone").patch(protect, updatePhone);

  router
    .route("/change-address")
    .patch(protect, updateAddress)
    .delete(protect, deleteAddress);

  router.route("/forgot-password").post(forgotPassword);
  router.route("/verify-email/:token").get(verifyEmail);
  router.route("/reset-password/:token").post(resetPassword);

  router
    .route("/")
    .get(protect, checkAccess, getAll)
    .post(protect, checkAccess, upload.single("image"), create);

  router
    .route("/:id")
    .get(protect, checkAccess, checkObjectId, getOne)
    .delete(protect, checkAccess, checkObjectId, deleteOne)
    .patch(protect, checkObjectId, upload.single("image"), updateOne);
}

module.exports = router;
