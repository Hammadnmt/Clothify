// generateOrders.js
const fs = require("fs");
const { faker } = require("@faker-js/faker");
const {
  PAYMENT_METHODS,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  generateAddress,
  generateObjectId,
} = require("./utils");

const generateOrderItems = (products, itemCount) => {
  const items = [];
  const selectedProducts = faker.helpers.arrayElements(products, itemCount);

  selectedProducts.forEach((product) => {
    // Select a random variant
    const variant = faker.helpers.arrayElement(product.variants);
    // Select a random size from the variant's sizes array
    const sizeData = faker.helpers.arrayElement(variant.sizes);

    // Only add item if there's stock available
    if (sizeData.stock > 0) {
      const quantity = faker.number.int({
        min: 1,
        max: Math.min(5, sizeData.stock), // Ensure quantity doesn't exceed available stock
      });
      const price = product.price.sale || product.price.base;

      items.push({
        product: product._id,
        variant: {
          size: sizeData.size,
          color: variant.color,
        },
        quantity,
        price,
        total: price * quantity,
        currency: product.price.currency,
      });
    }
  });

  return items;
};

const generateOrders = (users, products, count = 2000) => {
  const orders = [];
  const validProducts = products.filter((product) =>
    product.variants.some((variant) =>
      variant.sizes.some((size) => size.stock > 0)
    )
  );

  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(users);
    const itemCount = faker.number.int({ min: 1, max: 5 });
    const items = generateOrderItems(validProducts, itemCount);

    // Only create order if there are items (some might be skipped due to stock)
    if (items.length > 0) {
      const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
      const uniqueItems = new Set(items.map((item) => item.product)).size;
      const createdAt = faker.date.recent({ days: 90 });

      // Ensure updatedAt is never before createdAt
      const updatedAt = faker.date.between({
        from: createdAt,
        to: new Date(),
      });

      const order = {
        _id: generateObjectId(),
        user: user._id,
        items,
        totalAmount,
        summary: {
          totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
          uniqueItems,
          averageItemPrice: Number((totalAmount / items.length).toFixed(2)),
          currency: items[0].currency, // All items will have same currency from product
        },
        paymentMethod: faker.helpers.arrayElement(PAYMENT_METHODS),
        paymentStatus: faker.helpers.arrayElement(PAYMENT_STATUSES),
        orderStatus: faker.helpers.arrayElement(ORDER_STATUSES),
        shippingAddress: generateAddress(),
        notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
        createdBy: user._id,
        lastModifiedBy: user._id,
        createdAt,
        updatedAt,
      };

      orders.push(order);
    }
  }

  // Sort orders by createdAt date before saving
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  fs.writeFileSync(
    "orders_data.json",
    JSON.stringify(orders, null, 2),
    "utf-8"
  );

  console.log(
    `Generated ${orders.length} orders and saved to orders_data.json`
  );
  return orders;
};

module.exports = { generateOrders };
