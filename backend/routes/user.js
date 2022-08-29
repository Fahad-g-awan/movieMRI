const express = require("express");
const { isValidPasswordToken } = require("../middlewares/user");
const { isAuth } = require("../middlewares/auth");

const {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
  sendResetPassTokenStatus,
  resetPassword,
  signin,
} = require("../controllers/user");
const {
  userValidator,
  validate,
  validatePassword,
  signinValidator,
} = require("../middlewares/validator");

const router = express.Router();

router.post("/create", userValidator, validate, create);
router.post("/signin", signinValidator, validate, signin);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-otp", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post("/verify-password-reset-token", isValidPasswordToken, sendResetPassTokenStatus);
router.post("/reset-password", validatePassword, validate, isValidPasswordToken, resetPassword);

router.get("/is-auth", isAuth, (req, res) => {
  const { user } = req;
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
    },
  });
});

module.exports = router;
