const fs = require("fs");
const Product = require("../models/product");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");
const Brand = require("../models/brand");
const paginate = require("../util/paginate");
const exceptionHandler = require("../middlewares/exceptionHandler");
const AppError = require("../util/appError");
const validateObjectName = require("../util/validateObjectName");
const {
  uploadProductImages,
  deleteProductImages,
  deleteProductImage,
} = require("../util/cloudinary");
const validateObjectId = require("../util/validateObjectId");

async function validateSubCategory(categoryId, subCategoryId) {
  if (!categoryId || !subCategoryId) {
    throw new AppError("Category and Subcategory ID's are required");
  }

  const category = await Category.findById({ _id: categoryId });

  if (!category) {
    throw new AppError(`Invalid Category: ${categoryId}`);
  }

  const subCategory = await SubCategory.findOne({
    _id: subCategoryId,
    category: category._id,
  });

  if (!subCategory) {
    throw new AppError(
      `Invalid Subcategory: ${subCategoryId} for category ${categoryId}`
    );
  }

  return subCategory._id;
}

async function validateVariants(variants) {
  const processedVariants = JSON.parse(variants);
  const validSizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  const colorSizePairs = new Set();

  for (const variant of processedVariants) {
    if (!variant.color || typeof variant.color !== "string") {
      throw new AppError("Invalid or missing color in variant", 400);
    }

    if (!Array.isArray(variant.sizes)) {
      throw new AppError(`Invalid sizes for color ${variant.color}`, 400);
    }

    for (const sizeObj of variant.sizes) {
      if (!sizeObj.size || !validSizes.includes(sizeObj.size)) {
        throw new AppError(`Invalid size: ${sizeObj.size}`, 400);
      }

      if (typeof sizeObj.stock !== "number" || sizeObj.stock < 0) {
        throw new AppError(
          `Invalid stock quantity for size ${sizeObj.size}`,
          400
        );
      }

      const pair = `${variant.color}-${sizeObj.size}`;
      if (colorSizePairs.has(pair)) {
        throw new AppError(`Duplicate color-size combination: ${pair}`, 400);
      }
      colorSizePairs.add(pair);
    }
  }

  return processedVariants;
}

//@desc Create a product
//@route POST /api/v1/products/
//@access Private/Admin
exports.create = exceptionHandler(async (req, res, next) => {
  const price = JSON.parse(req.body.price);
  const materials = JSON.parse(req.body.materials);
  const tags = JSON.parse(req.body.tags);

  const [validCategory, validSubCategory, validBrand] = await Promise.all([
    validateObjectId(Category, req.body.category),
    validateSubCategory(req.body.category, req.body.subCategory),
    validateObjectId(Brand, req.body.brand),
  ]);

  const processedVariants = await validateVariants(req.body.variants);

  const product = await Product.create({
    name: req.body.name,
    description: req.body.description,
    price,
    category: validCategory,
    subCategory: validSubCategory,
    brand: validBrand,
    materials,
    tags,
    seasonality: req.body.seasonality,
    gender: req.body.gender,
    variants: processedVariants,
    images: [],
  });

  if (!product) {
    throw new AppError("Something went wrong while creating the product", 400);
  }

  const imagePaths = req.files ? req.files.map((file) => file.path) : [];

  const uploadedImageUrls = await uploadProductImages(product._id, imagePaths);

  if (req.files) {
    req.files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    { images: uploadedImageUrls },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    data: updatedProduct,
  });
});

//@desc Get all products
//@route GET /api/v1/products/
//@access Public
exports.getAll = exceptionHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = process.env.LIMIT || 10,
    category,
    subCategory,
    brand,
    priceMin,
    priceMax,
    search,
    sort,
    size,
    color,
    gender,
    seasonality,
    ratings,
    stock,
  } = req.query;

  const filter = {};

  if (category) filter.category = await validateObjectName(Category, category);
  if (subCategory)
    filter.subCategory = await validateObjectName(SubCategory, subCategory);
  if (brand) filter.brand = await validateObjectName(Brand, brand);

  if (priceMin || priceMax) {
    filter["price.base"] = {};
    if (priceMin) filter["price.base"].$gte = parseFloat(priceMin);
    if (priceMax) filter["price.base"].$lte = parseFloat(priceMax);
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  if (size || color) {
    filter.variants = {
      $elemMatch: {
        ...(color && { color }),
        ...(size && {
          sizes: {
            $elemMatch: { size },
          },
        }),
      },
    };
  }

  if (gender) filter.gender = gender;
  if (seasonality) filter.seasonality = seasonality;

  if (ratings) filter["ratings.average"] = { $eq: parseFloat(ratings) };

  if (stock === "in") {
    filter.variants = {
      $elemMatch: {
        sizes: {
          $elemMatch: { stock: { $gt: 0 } },
        },
      },
    };
  }
  if (stock === "out") {
    filter.variants = {
      $not: {
        $elemMatch: {
          sizes: {
            $elemMatch: { stock: { $gt: 0 } },
          },
        },
      },
    };
  }

  const sortOptions = {
    "low-high": { "price.base": 1 },
    "high-low": { "price.base": -1 },
    "new-old": { createdAt: -1 },
    "old-new": { createdAt: 1 },
    "a-z": { name: 1 },
    "z-a": { name: -1 },
  };

  const sortOrder = sortOptions[sort] || { createdAt: -1 };

  const { data: products, pagination } = await paginate(
    Product,
    filter,
    sortOrder,
    [
      { path: "category", select: "name" },
      { path: "subCategory", select: "name" },
      { path: "brand", select: "name" },
    ],
    page,
    limit
  );

  res.status(200).json({
    status: "success",
    pagination,
    data: products.length > 0 ? products : [],
  });
});

//@desc Get a product
//@route GET /api/v1/products/:id
//@access Public
exports.getOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("category", "name")
    .populate("subCategory", "name")
    .populate("brand", "name logo");

  if (!product) {
    return next(new AppError(`Product with ID: ${id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    product,
  });
});

//@desc Delete a product
//@route DELETE /api/v1/products/:id
//@access Private/Admin
exports.deleteOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    return next(new AppError(`Product with ID: ${id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product successfully deleted",
    product: deletedProduct,
  });
});

//@desc Update a product
//@route PATCH /api/v1/products/:id
//@access Private/Admin
exports.updateOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const existingProduct = await Product.findById(id);
  if (!existingProduct) {
    throw new AppError(`Product with ID: ${id} not found`, 404);
  }

  const updateData = {};
  // console.log(req.body);
  if (req.body.name) updateData.name = req.body.name;
  if (req.body.description) updateData.description = req.body.description;
  if (req.body.price) updateData.price = JSON.parse(req.body.price);
  if (req.body.seasonality) updateData.seasonality = req.body.seasonality;
  if (req.body.gender) updateData.gender = req.body.gender;

  if (req.body.materials) {
    updateData.materials = JSON.parse(req.body.materials);
  }
  if (req.body.tags) {
    updateData.tags = JSON.parse(req.body.tags);
  }

  if (req.body.category || req.body.subCategory || req.body.brand) {
    const [validCategory, validSubCategory, validBrand] = await Promise.all([
      req.body.category
        ? validateObjectId(Category, req.body.category)
        : undefined,
      req.body.category && req.body.subCategory
        ? validateSubCategory(req.body.category, req.body.subCategory)
        : undefined,
      req.body.brand ? validateObjectId(Brand, req.body.brand) : undefined,
    ]);

    if (validCategory) updateData.category = validCategory;
    if (validSubCategory) updateData.subCategory = validSubCategory;
    if (validBrand) updateData.brand = validBrand;
  }

  if (req.body.variants) {
    updateData.variants = await validateVariants(req.body.variants);
  }

  if (req.files && req.files.length > 0) {
    await deleteProductImages(id);

    const imagePaths = req.files.map((file) => file.path);
    const uploadedImageUrls = await uploadProductImages(id, imagePaths);

    req.files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    });

    updateData.images = uploadedImageUrls;
  }

  console.log(updateData);

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    runValidators: true,
    new: true,
    context: "query",
  });

  if (!updatedProduct) {
    throw new AppError("Something went wrong while updating the product", 400);
  }

  res.status(200).json({
    status: "success",
    data: updatedProduct,
  });
});

//@desc Delete a variant image of a product
//@route DELETE /api/v1/products/:id/variants/:variantIndex/images/:imageIndex
//@access Private/Admin
exports.deleteVariantImage = exceptionHandler(async (req, res, next) => {
  const { id, variantIndex, imageIndex } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(`Product with ID: ${id} not found`, 404);
  }

  const variant = product.variants[variantIndex];
  if (!variant) {
    throw new AppError("Variant not found", 404);
  }

  // Delete image from Cloudinary
  await deleteProductImage(id, imageIndex + 1, variant);

  // Remove image URL from variant
  variant.images.splice(imageIndex, 1);
  await product.save();

  res.status(200).json({
    status: "success",
    message: "Image deleted successfully",
    data: product,
  });
});

//@desc Get trending products
//@route GET /api/v1/products/trending
//@access Public
exports.getTrending = exceptionHandler(async (req, res, next) => {
  const limit = 10;

  const trendingProducts = await Product.find({
    "ratings.average": { $gte: 4 },
  })
    .sort({ "ratings.average": -1 })
    .limit(Number(limit))
    .populate("category", "name")
    .populate("brand", "name");

  res.status(200).json({
    status: "success",
    count: trendingProducts.length,
    data: trendingProducts.length > 0 ? trendingProducts : [],
  });
});
