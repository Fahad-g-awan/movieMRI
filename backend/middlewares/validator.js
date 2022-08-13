const { check, validationResult } = require("express-validator");

exports.userValidator = [
  check("name").trim().not().isEmpty().withMessage("The name field is required"),

  check("email").normalizeEmail().isEmail().withMessage("Email is not valid"),

  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("The password field is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password length must be minimum 8 chracters long"),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();

  if (error.length) {
    return res.json({ error: error[0].msg });
  }

  next();
};
