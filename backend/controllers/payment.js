const stripe = require("../config/stripe");
const Order = require("../models/order");
const AppError = require("../util/appError");
const exceptionHandler = require("../middlewares/exceptionHandler");

exports.createPaymentIntent = exceptionHandler(async (req, res, next) => {
  const { orderId } = req.body;
  console.log(orderId);

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (order.paymentStatus === "Completed") {
    return next(new AppError("Order is already paid", 400));
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalAmount * 100),
    currency: "usd",
    metadata: {
      orderId: order._id.toString(),
      userId: req.user._id.toString(),
    },
  });

  res.status(200).json({
    status: "success",
    clientSecret: paymentIntent.client_secret,
  });
});

exports.handleWebhook = exceptionHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "Completed",
      orderStatus: "Processing",
      lastModifiedBy: paymentIntent.metadata.userId,
    });
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "Failed",
      lastModifiedBy: paymentIntent.metadata.userId,
    });
  }

  res.json({ received: true });
});
