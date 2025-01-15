const AppError = require("./appError");

const validateObjectId = async (Model, _id) => {
  if (!_id) {
    throw new AppError(`${Model.modelName} ID is required`, 400);
  }

  const document = await Model.findOne({ _id });

  if (!document) {
    throw new AppError(`Invalid ${Model.modelName} _id: ${_id}`, 404);
  }

  return document._id;
};

module.exports = validateObjectId;
