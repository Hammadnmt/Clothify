const AppError = require("../util/appError");

const validateOrderItems = (req, res, next) => {
  const { items } = req.body;

  // Check if items exist and is an array
  if (!items || !Array.isArray(items)) {
    return next(new AppError("Items must be a non-empty array", 400));
  }

  // Check if items array is empty
  if (items.length === 0) {
    return next(new AppError("Order must contain at least one item", 400));
  }

  // Validate each item
  for (const item of items) {
    // Check required fields
    const requiredFields = ["_id", "quantity", "size", "color"];
    const missingFields = requiredFields.filter((field) => !item[field]);

    if (missingFields.length > 0) {
      return next(
        new AppError(
          `Missing required fields: ${missingFields.join(", ")}`,
          400
        )
      );
    }

    // Validate quantity
    if (!Number.isInteger(item.quantity)) {
      return next(
        new AppError(`Quantity must be an integer for item ${item._id}`, 400)
      );
    }

    if (item.quantity <= 0) {
      return next(
        new AppError(
          `Quantity must be greater than 0 for item ${item._id}`,
          400
        )
      );
    }

    // Validate size format
    const validSizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
    if (!validSizes.includes(item.size.toUpperCase())) {
      return next(
        new AppError(
          `Invalid size '${item.size}' for item ${
            item._id
          }. Valid sizes are: ${validSizes.join(", ")}`,
          400
        )
      );
    }

    // Validate color
    if (typeof item.color !== "string" || item.color.trim().length === 0) {
      return next(
        new AppError(`Invalid color format for item ${item._id}`, 400)
      );
    }

    // Sanitize data
    item.size = item.size.toUpperCase();
    item.color = item.color.trim();
  }

  next();
};

module.exports = validateOrderItems;
