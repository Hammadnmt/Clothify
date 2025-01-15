const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const {
  getAll,
  getAllMine,
  markHelpful,
  create,
  getOne,
  updateOne,
  deleteOne,
} = require("../controllers/review");

router.route("/mine").get(protect, getAllMine);

router.route("/helpful/:id").patch(protect, markHelpful);

router.route("/").get(getAll).post(protect, create);

router
  .route("/:id")
  .get(getOne)
  .patch(protect, updateOne)
  .delete(protect, deleteOne);

module.exports = router;
