const { isValidObjectId } = require("mongoose");
const PasswordRestToken = require("../models/PasswordRestToken");
const { sendError } = require("../utils/helper");

exports.isValidPasswordToken = async (req, res, next) => {
  const { token, userId } = req.body;

  if (!token?.trim() || !isValidObjectId(userId))
    return sendError(res, "Invalid request, user Id or token is not valid");

  const resetToken = await PasswordRestToken.findOne({ owner: userId });

  if (!resetToken) return sendError(res, "Unauthorize access, token has expired");

  const isMatched = await resetToken.compareToken(token);

  if (!isMatched) return sendError(res, "Unauthorize access, token does not match");

  req.resetToken = resetToken;

  next();
};
