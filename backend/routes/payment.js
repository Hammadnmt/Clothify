const express = require("express");
const {
  createPaymentIntent,
  handleWebhook,
} = require("../controllers/payment");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/create-payment-intent", protect, createPaymentIntent);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

module.exports = router;
