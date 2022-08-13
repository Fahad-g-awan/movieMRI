const EmailVerificationToken = require("../models/EmailVerificationToken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const { isValidObjectId } = require("mongoose");
const { generateOTP } = require("../utils/mail");
const { sendError } = require("../utils/helper");

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
    message: `Please verify your account, OTP has been sent to your email address: ${newUser.email}`,
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

  res.status(201).json({ message: "Your email has been verified" });
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
    message: `Please verify your account, new OTP has been sent to your email address: ${user.email}`,
  });
};
