const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const AppError = require("../util/appError");
const paginate = require("../util/paginate");
const exceptionHandler = require("../middlewares/exceptionHandler");
const stripe = require("../config/stripe");

const defaultPopulateOptions = [
  {
    path: "items.product",
    select:
      "_id name variants price brand category subCategory gender seasonality ratings images",
  },
  {
    path: "user",
    select: "_id name email role phone",
  },
  {
    path: "createdBy",
    select: "_id name email",
  },
  {
    path: "lastModifiedBy",
    select: "_id name email",
  },
];

//@desc Create an order
//@route POST /api/v1/orders
//@access Private
exports.create = exceptionHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  let order = null;

  try {
    await session.withTransaction(async () => {
      const { items, shippingAddress, paymentMethod, notes } = req.body;

      if (!items?.length || !shippingAddress || !paymentMethod) {
        throw new AppError("Invalid order creation pattern", 400);
      }

      let totalAmount = 0;
      const validatedItems = await Promise.all(
        items.map(async (item) => {
          const product = await Product.findById(item._id).session(session);

          if (!product) {
            throw new AppError(`Product with ID ${item._id} not found`, 404);
          }

          // Find the variant with matching color and size
          const variant = product.variants.find(
            (v) => v.color.toLowerCase() === item.color.toLowerCase()
          );

          if (!variant) {
            throw new AppError(
              `Variant with color ${item.color} not found for product ${product.name}`,
              400
            );
          }

          // Find the size within the variant
          const sizeObj = variant.sizes.find(
            (s) => s.size.toLowerCase() === item.size.toLowerCase()
          );

          if (!sizeObj) {
            throw new AppError(
              `Size ${item.size} not found for product ${product.name} in color ${item.color}`,
              400
            );
          }

          if (sizeObj.stock < item.quantity) {
            throw new AppError(
              `Product ${product.name} (${item.size}/${item.color}) is out of stock. Available: ${sizeObj.stock}`,
              400
            );
          }

          const price =
            product.price.sale && product.price.sale < product.price.base
              ? product.price.sale
              : product.price.base;

          const total = parseFloat((price * item.quantity).toFixed(2));
          totalAmount += total;

          sizeObj.stock -= item.quantity;
          await product.save({ session });

          return {
            product: item._id,
            variant: {
              size: item.size,
              color: item.color,
              image: product.images[0],
            },
            quantity: item.quantity,
            price,
            total,
            currency: product.price.currency,
          };
        })
      );

      totalAmount = parseFloat(totalAmount.toFixed(2));

      order = new Order({
        user: req.user._id,
        items: validatedItems,
        totalAmount,
        paymentMethod,
        shippingAddress,
        notes,
        currency: validatedItems[0]?.currency || "USD",
        summary: {
          totalItems: validatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
          uniqueItems: validatedItems.length,
          averageItemPrice: parseFloat(
            (
              totalAmount /
              validatedItems.reduce((sum, item) => sum + item.quantity, 0)
            ).toFixed(2)
          ),
        },
        createdBy: req.user._id,
        lastModifiedBy: req.user._id,
      });

      await order.save({ session });

      if (["Credit Card", "Debit Card"].includes(paymentMethod)) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(totalAmount * 100),
          currency: "usd",
          metadata: {
            orderId: order._id.toString(),
            userId: req.user._id.toString(),
          },
        });
        console.log(paymentIntent);
        order.paymentIntentId = paymentIntent.id;
        await order.save({ session });
      }
    });

    // Only populate after transaction is committed
    const populatedOrder = await Order.findById(order._id).populate(
      defaultPopulateOptions
    );

    res.status(201).json({
      status: "success",
      data: populatedOrder,
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
});

//@desc Get all orders
//@route GET /api/v1/orders
//@access Private/Admin
exports.getAll = exceptionHandler(async (req, res, next) => {
  const {
    page,
    limit,
    search,
    orderStatus,
    paymentStatus,
    paymentMethod,
    minTotal,
    maxTotal,
    startDate,
    endDate,
    sortBy,
  } = req.query;

  let filter = {};

  if (search) {
    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    const userIds = matchingUsers.map((user) => user._id);

    filter.$or = [
      { user: { $in: userIds } },
      { "shippingAddress.fullName": { $regex: search, $options: "i" } },
      { "shippingAddress.address": { $regex: search, $options: "i" } },
      { "shippingAddress.city": { $regex: search, $options: "i" } },
      { "shippingAddress.country": { $regex: search, $options: "i" } },
    ];
  }

  if (orderStatus) {
    filter.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  if (paymentMethod) {
    filter.paymentMethod = paymentMethod;
  }

  if (minTotal || maxTotal) {
    filter.totalAmount = {};
    if (minTotal) filter.totalAmount.$gte = Number(minTotal);
    if (maxTotal) filter.totalAmount.$lte = Number(maxTotal);
  }

  // if (startDate || endDate) {
  //   filter.createdAt = {};
  //   if (startDate) {
  //     const startDateTime = new Date(startDate);
  //     startDateTime.setHours(0, 0, 0, 0);
  //     filter.createdAt.$gte = startDateTime;
  //   }
  //   if (endDate) {
  //     const endDateTime = new Date(endDate);
  //     endDateTime.setHours(23, 59, 59, 999);
  //     filter.createdAt.$lte = endDateTime;
  //   }
  // }

  let sortOrder = { createdAt: -1 };
  if (sortBy) {
    switch (sortBy) {
      case "total-asc":
        sortOrder = { totalAmount: 1 };
        break;
      case "total-desc":
        sortOrder = { totalAmount: -1 };
        break;
      case "date-asc":
        sortOrder = { createdAt: 1 };
        break;
      case "date-desc":
        sortOrder = { createdAt: -1 };
        break;
    }
  }

  const populateOptions = [
    {
      path: "user",
      select: "name email phone",
    },
    {
      path: "items.product",
      select: "name images price",
    },
    {
      path: "createdBy",
      select: "name",
    },
    {
      path: "lastModifiedBy",
      select: "name",
    },
  ];
  const { data: orders, pagination } = await paginate(
    Order,
    filter,
    sortOrder,
    populateOptions,
    page,
    limit
  );

  res.status(200).json({
    status: "success",
    pagination,
    data: orders,
  });
});

//@desc Get all orders of logged in user
//@route GET /api/v1/orders
//@access Private
exports.getAllMine = exceptionHandler(async (req, res, next) => {
  const { _id } = req.user._doc;
  const { page } = req.query;
  const filters = { user: _id };

  const { data: orders, pagination } = await paginate(
    Order,
    filters,
    { createdAt: -1 },
    defaultPopulateOptions,
    page
  );

  res.status(200).json({
    status: "success",
    pagination,
    data: orders.length > 0 ? orders : [],
  });
});

//@desc Get a single order
//@route GET /api/v1/orders/:id
//@access Private
exports.getOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate(defaultPopulateOptions);

  if (!order) {
    return next(new AppError(`Order ID: ${id} doesn't exist`, 404));
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

//@desc Update a single order
//@route PATCH /api/v1/orders/:id
//@access Private/Admin
exports.updateOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new AppError(`Order ID: ${id} doesn't exist`, 404));
  }

  if (!order.canBeModified()) {
    return next(new AppError("This order cannot be modified", 400));
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      ...req.body,
      lastModifiedBy: req.user._id,
    },
    {
      runValidators: true,
      new: true,
    }
  ).populate(defaultPopulateOptions);

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

//@desc Delete a single order
//@route DELETE /api/v1/orders/:id
//@access Private/Admin
exports.deleteOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) {
    return next(new AppError(`Order ID: ${id} doesn't exist`, 404));
  }

  if (order.orderStatus !== "Cancelled") {
    return next(new AppError("Only cancelled orders can be deleted", 400));
  }

  await order.deleteOne();

  res.status(200).json({
    status: "success",
    data: order,
  });
});

//@desc Update the payment status of order
//@route PATCH /api/v1/orders/:id/payment
//@access Private/Admin
exports.updatePaymentStatus = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  if (!paymentStatus) {
    return next(new AppError("Payment status not valid", 400));
  }

  const order = await Order.findById(id);

  if (!order) {
    return next(new AppError(`Order ID: ${id} doesn't exist`, 404));
  }

  if (order.orderStatus === "Cancelled") {
    return next(
      new AppError("Cannot update payment status of cancelled order", 400)
    );
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      paymentStatus,
      lastModifiedBy: req.user._id,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

//@desc Update the order status
//@route PATCH /api/v1/orders/:id/order/status
//@access Private/Admin
exports.updateOrderStatus = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  if (!orderStatus) {
    return next(new AppError("Order status not valid", 400));
  }

  const order = await Order.findById(id);

  if (!order) {
    return next(new AppError(`Order ID: ${id} doesn't exist`, 404));
  }

  if (!order.canBeModified()) {
    return next(new AppError("Order status cannot be modified", 400));
  }

  if (
    order.orderStatus === "Pending" &&
    !["Processing", "Cancelled"].includes(orderStatus)
  ) {
    return next(new AppError("Invalid status transition from Pending", 400));
  }

  if (orderStatus === "Cancelled" && !order.canBeCancelled()) {
    return next(
      new AppError("Invalid status transition, order can't be cancelled", 400)
    );
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus,
      lastModifiedBy: req.user._id,
    },
    {
      runValidators: true,
      new: true,
    }
  ).populate(defaultPopulateOptions);

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});
