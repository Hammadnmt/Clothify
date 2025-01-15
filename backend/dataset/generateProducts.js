// generateProducts.js
const fs = require("fs");
const { faker } = require("@faker-js/faker");
const validator = require("validator");
const {
  SIZES,
  COLORS,
  MATERIALS,
  SEASONS,
  GENDERS,
  generateObjectId,
} = require("./utils");

const generateProductVariants = () => {
  const variants = [];
  // Keep track of used color-size combinations globally
  const usedCombinations = new Set();
  const variantCount = faker.number.int({ min: 1, max: COLORS.length }); // Limit variants to available colors

  // Get random colors without repetition
  const selectedColors = faker.helpers.shuffle(COLORS).slice(0, variantCount);

  selectedColors.forEach((color) => {
    // For each color, get random sizes that haven't been used with this color
    const availableSizes = SIZES.filter(
      (size) => !usedCombinations.has(`${color}-${size}`)
    );

    if (availableSizes.length > 0) {
      // Get random number of sizes for this color
      const sizeCount = faker.number.int({
        min: 1,
        max: availableSizes.length,
      });
      const variantSizes = faker.helpers
        .shuffle(availableSizes)
        .slice(0, sizeCount);

      // Create size objects and mark combinations as used
      const sizes = variantSizes.map((size) => {
        usedCombinations.add(`${color}-${size}`);
        return {
          size: size,
          stock: faker.number.int({ min: 0, max: 100 }),
        };
      });

      // Only add variant if it has sizes
      if (sizes.length > 0) {
        variants.push({
          color: color,
          sizes: sizes,
        });
      }
    }
  });

  return variants;
};

const generateValidImageUrl = () => {
  const imageUrl = faker.image.url();
  return validator.isURL(imageUrl)
    ? imageUrl
    : "https://example.com/placeholder.jpg";
};

const generateProducts = (baseData, count = 1000) => {
  const products = [];
  const { categories, subCategories, brands } = baseData;

  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(categories);
    const validSubCategories = subCategories.filter(
      (sub) => sub.category.toString() === category._id.toString()
    );
    const validBrands = brands.filter((brand) =>
      brand.categories.includes(category._id)
    );

    const basePrice = faker.number.float({ min: 20, max: 500, precision: 2 });
    const salePrice = faker.datatype.boolean()
      ? basePrice * faker.number.float({ min: 0.5, max: 0.9, precision: 2 })
      : null;

    const variants = generateProductVariants();

    // Only create product if valid variants were generated
    if (variants.length > 0) {
      const product = {
        _id: generateObjectId(),
        name: faker.commerce.productName().substring(0, 100),
        description: faker.commerce.productDescription(),
        price: {
          base: basePrice,
          sale: salePrice,
          currency: faker.helpers.arrayElement(["USD", "EUR"]),
        },
        category: category._id,
        subCategory: faker.helpers.arrayElement(validSubCategories)._id,
        brand: faker.helpers.arrayElement(validBrands)._id,
        variants: variants,
        materials: faker.helpers.arrayElements(MATERIALS, { min: 1, max: 3 }),
        tags: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () =>
          faker.commerce.productAdjective().toLowerCase()
        ),
        seasonality: faker.helpers.arrayElement(SEASONS),
        gender: faker.helpers.arrayElement(GENDERS),
        ratings: {
          average: faker.number.float({ min: 0, max: 5, precision: 1 }),
          count: faker.number.int({ min: 0, max: 1000 }),
        },
        images: Array.from(
          { length: faker.number.int({ min: 1, max: 4 }) },
          generateValidImageUrl
        ),
      };

      products.push(product);
    }
  }

  fs.writeFileSync(
    "products_data.json",
    JSON.stringify(products, null, 2),
    "utf-8"
  );

  console.log(
    `Generated ${products.length} products and saved to products_data.json`
  );
  return products;
};

module.exports = { generateProducts };
