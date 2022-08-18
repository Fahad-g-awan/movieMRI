const EmailVerificationToken = require("../models/EmailVerificationToken");
const PasswordRestToken = require("../models/PasswordRestToken");
const User = require("../models/User");

const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helper");
const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return sendError(res, "The email you entered already exists");
  }

  const newUser = await User({ name, email, password });

  await newUser.save();

  let OTP = generateOTP();

  const newEmailVerificaitonToken = await EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  await newEmailVerificaitonToken.save();

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@moviemri.com",
    to: newUser.email,
    subject: "Email Verification OTP",
    html: `
      <p>This is your verification OTP</p>
      <h1>${OTP}</h1>
    `,
  });

  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId)) return sendError(res, "Invalid user id");

  const user = await User.findById(userId);

  if (!user) return sendError(res, "User not found", 404);

  if (user.isVerified) return sendError(res, "User has already been verified");

  const token = await EmailVerificationToken.findOne({ owner: userId });

  if (!token) return sendError(res, "Token not found");

  const isMatched = await token.compareToken(OTP);

  if (!isMatched) return sendError(res, "Please submit a valid OTP");

  user.isVerified = true;

  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@moviemri.com",
    to: user.email,
    subject: "Welcom Email from MoieMRI",
    html: `
      <p>Your has been verified, thank you for chooseing movieMRI</p>
    `,
  });

  const jwtToken = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
      isVerified: user.isVerified,
    },
    message: "Your email has been verified successfully",
  });
};

exports.resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user) return sendError(res, "User not found", 404);

  if (user.isVerified) return sendError(res, "User has already been verified");

  const alreadyHasToken = await EmailVerificationToken.findOne({ owner: userId });

  if (alreadyHasToken) return sendError(res, "You cannot request for another OTP before one hour");

  let OTP = generateOTP();

  const newEmailVerificaitonToken = await EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });

  await newEmailVerificaitonToken.save();

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@moviemri.com",
    to: user.email,
    subject: "Email Verification OTP",
    html: `
      <p>This is your verification OTP</p>
      <h1>${OTP}</h1>
    `,
  });

  res.status(201).json({
    message: `New OTP has been sent to your email address: ${user.email}`,
  });
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return sendError(res, "There is no user associated with this email address", 404);

  const alreadyHasToken = await PasswordRestToken.findOne({ owner: user._id });

  if (alreadyHasToken) return sendError(res, "You cannot request for another OTP before one hour");

  const token = await generateRandomByte();

  const newPasswordRestToken = await PasswordRestToken({
    owner: user._id,
    token,
  });

  await newPasswordRestToken.save();

  const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@moviemri.com",
    to: user.email,
    subject: "password Reset",
    html: `
      <p>Click here to reset your password:</p>
      <a href="${resetPasswordUrl}">Reset Password</a>
    `,
  });

  res.status(201).json({
    message: `Reset password link has been sent to your email address: ${user.email}`,
  });
};

exports.sendResetPassTokenStatus = (req, res) => {
  res.json({ valid: true });
};

exports.resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  const user = await User.findById(userId);

  const isMatched = await user.comparePassword(newPassword);

  if (isMatched) return sendError(res, "New password must be different from the old one");

  user.password = newPassword;

  await user.save();

  await PasswordRestToken.findByIdAndDelete(req.resetToken._id);

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@moviemri.com",
    to: user.email,
    subject: "Password Reset Successfull",
    html: `
      <p>Your password has been reset, please signin with your new password</p>
    `,
  });

  res.status(201).json({
    message: "Your password has been reset, please signin with your new password",
  });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return sendError(res, "Email or password is incorrect");

  const isMatched = await user.comparePassword(password);

  if (!isMatched) return sendError(res, "Email or password is incorrect");

  const { _id, name, role, isVerified } = user;

  const jwtToken = await jwt.sign({ userId: _id }, process.env.JWT_SECRET);

  res.status(201).json({ user: { id: _id, name, email, role, token: jwtToken, isVerified } });
};
