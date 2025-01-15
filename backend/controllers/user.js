const User = require("../models/user");
const paginate = require("../util/paginate");
const AppError = require("../util/appError");
const exceptionHandler = require("../middlewares/exceptionHandler");
const { uploadProfileImage } = require("../util/cloudinary");

//@desc Create a user
//@route POST /api/v1/users/
//@access Private/Admin
exports.create = exceptionHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    addresses,
    isActive,
    emailVerified,
    phoneVerified,
  } = req.body;
  const imagePath = req?.file?.path;
  console.log(imagePath);
  let parsedAddresses = [];
  if (typeof addresses === "string") {
    parsedAddresses = JSON.parse(addresses);
  }

  let newUser = await User.create({
    name,
    email,
    password,
    role,
    phone,
    addresses: parsedAddresses || [],
    isActive,
    emailVerified,
    phoneVerified,
  });

  if (!newUser) {
    return next(
      new AppError("Something went wrong while creating the user", 400)
    );
  }

  if (imagePath) {
    const profileImageUrl = await uploadProfileImage(newUser._id, imagePath);

    if (!profileImageUrl) {
      return next(new AppError("Error uploading profile image", 500));
    }

    const user = await User.findById(newUser._id);

    user.image = profileImageUrl;

    const updatedUser = await user.save();

    if (!updatedUser) {
      return next(new AppError("Unable to save the user profile image", 500));
    }
    newUser = updatedUser;
  }

  res.status(201).json({
    status: "success",
    user: newUser,
  });
});

//@desc Get all users
//@route GET /api/v1/users/
//@access Private/Admin
exports.getAll = exceptionHandler(async (req, res, next) => {
  const {
    page,
    limit,
    search,
    role,
    emailVerified,
    phoneVerified,
    isActive,
    sort,
    createdAtStart,
    createdAtEnd,
    lastLoginStart,
    lastLoginEnd,
    country,
  } = req.query;

  let filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (role) filter.role = role.toLowerCase();

  if (emailVerified) filter.emailVerified = emailVerified === "true";
  if (phoneVerified) filter.phoneVerified = phoneVerified === "true";
  if (isActive) filter.isActive = isActive === "true";

  if (createdAtStart || createdAtEnd) {
    filter.createdAt = {};
    if (createdAtStart) filter.createdAt.$gte = new Date(createdAtStart);
    if (createdAtEnd) filter.createdAt.$lte = new Date(createdAtEnd);
  }

  if (lastLoginStart || lastLoginEnd) {
    filter.lastLoginAt = {};
    if (lastLoginStart) filter.lastLoginAt.$gte = new Date(lastLoginStart);
    if (lastLoginEnd) filter.lastLoginAt.$lte = new Date(lastLoginEnd);
  }

  if (country) {
    filter["addresses.country"] = { $regex: country, $options: "i" };
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "last-active": { lastLoginAt: -1 },
    "name-asc": { name: 1 },
    "name-desc": { name: -1 },
  };

  const sortOrder = sortOptions[sort] || { createdAt: -1 };

  const { data: users, pagination } = await paginate(
    User,
    filter,
    sortOrder,
    [],
    page,
    limit
  );

  res.status(200).json({
    status: "success",
    pagination,
    data: users.length > 0 ? users : [],
  });
});

//@desc Get the logged in user
//@route Get /api/v1/users/mine
//@access Private
exports.getMine = exceptionHandler(async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findById(_id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

//@desc Get a user
//@route Get /api/v1/users/:id
//@access Private/Admin
exports.getOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError(`user with this ID: ${id} doesn't exist`, 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

//@desc Delete a user
//@route DELETE /api/v1/users/:id
//@access Private/Admin
exports.deleteOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete({ _id: id });

  if (!deletedUser) {
    return next(new AppError(`user with this ID: ${id} doesn't exist`, 404));
  }

  res.status(200).json({
    status: "success",
    user: deletedUser,
  });
});

//@desc Update a user
//@route PATCH /api/v1/users/:id
//@access Private/Admin
exports.updateOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const { addresses } = req.body;
  let parsedAddresses = [];

  if (typeof addresses === "string") {
    parsedAddresses = JSON.parse(addresses);
  }

  const updateData = {
    ...req.body,
    addresses: parsedAddresses.length > 0 ? parsedAddresses : undefined,
  };

  const imagePath = req?.file?.path;
  if (imagePath) {
    const profileImageUrl = await uploadProfileImage(id, imagePath);

    if (!profileImageUrl) {
      return next(new AppError("Error uploading profile image", 500));
    }

    updateData.image = profileImageUrl;
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    runValidators: true,
    new: true,
  });

  if (!updatedUser) {
    return next(new AppError(`User with this ID: ${id} doesn't exist`, 404));
  }

  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});

//@desc Update phone number of a logged in user
//@route PATCH /api/v1/users/change-phone
//@access Private
exports.updatePhone = exceptionHandler(async (req, res, next) => {
  const user = req.user;
  const { phone } = req.body;

  if (!phone) {
    return next(new AppError("Phone number is required", 404));
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { phone, phoneVerified: false },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!updatedUser) {
    return next(new AppError("User update failed", 500));
  }

  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});

//@desc Update a user address
//@route PATCH /api/v1/users/change-address
//@access Private
exports.updateAddress = exceptionHandler(async (req, res, next) => {
  const user = req.user;
  const { address, _id } = req.body;
  console.log("Received Data:", { address, _id });

  const foundUser = await User.findById(user._id);
  if (!foundUser) {
    return next(new AppError(`User with ID: ${user._id} not found`, 404));
  }

  let updatedUser;

  if (!_id) {
    foundUser.addresses.push(address);
    updatedUser = await foundUser.save();
  } else {
    const addressIndex = foundUser.addresses.findIndex(
      (addr) => addr._id.toString() === _id
    );

    if (addressIndex === -1) {
      return next(new AppError(`Address with ID: ${_id} not found`, 404));
    }

    foundUser.addresses[addressIndex] = {
      ...foundUser.addresses[addressIndex],
      ...address,
    };
    updatedUser = await foundUser.save();
  }

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

//@desc Delete a specific user address
//@route DELETE /api/v1/users/change-address
//@access Private
exports.deleteAddress = exceptionHandler(async (req, res, next) => {
  const user = req.user;
  const { _id } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $pull: { addresses: { _id } } },
    { new: true }
  );

  if (!updatedUser) {
    return next(new AppError(`User with ID: ${user._id} doesn't exist`, 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

//@desc Update a logged in user
//@route PATCH /api/v1/users/mine
//@access Private
exports.updateMine = exceptionHandler(async (req, res, next) => {
  const user = req.user;
  const { email, phone, name } = req.body;

  const updateData = {};

  if (req.file) {
    try {
      const imagePath = req.file.path;
      const profileImageUrl = await uploadProfileImage(user._id, imagePath);

      if (!profileImageUrl) {
        return next(new AppError("Error uploading profile image", 500));
      }

      updateData.image = profileImageUrl;
    } catch (error) {
      return next(new AppError("Error processing image upload", 500));
    }
  }

  if (name && name !== user.name) {
    updateData.name = name;
  }

  if (email && email !== user.email) {
    updateData.email = email;
    updateData.emailVerified = false;
  }

  if (phone && phone !== user.phone) {
    updateData.phone = phone;
    updateData.phoneVerified = false;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(200).json({
      status: "success",
      user: user,
    });
  }

  const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
    runValidators: true,
    new: true,
  });

  if (!updatedUser) {
    return next(new AppError(`User not found`, 404));
  }

  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});
