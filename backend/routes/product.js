const express = require("express");
const {
  getAll,
  create,
  getOne,
  deleteOne,
  updateOne,
  getTrending,
  deleteVariantImage,
} = require("../controllers/product");

const { productValidator } = require("../validators/product");

const checkValidation = require("../middlewares/checkValidation");
const { protect, checkAccess } = require("../middlewares/auth");
const checkObjectId = require("../middlewares/checkObjectId");
const { upload } = require("../middlewares/upload");

const router = express.Router();

if (process.env.NODE_ENV === "test") {
  router.route("/").get(getAll).post(create);
} else {
  router.route("/trending").get(getTrending);

  router.delete(
    "/:id/variants/:variantIndex/images/:imageIndex",
    protect,
    checkAccess,
    checkObjectId,
    deleteVariantImage
  );

  router
    .route("/")
    .get(getAll)
    .post(protect, checkAccess, upload.array("images", 30), create);

  router
    .route("/:id")
    .get(checkObjectId, getOne)
    .delete(protect, checkAccess, checkObjectId, deleteOne)
    .patch(
      protect,
      checkAccess,
      checkObjectId,
      upload.array("images", 30),
      updateOne
    );
}

module.exports = router;
