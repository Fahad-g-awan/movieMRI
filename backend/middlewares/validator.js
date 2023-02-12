const { check, validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const genres = require("../utils/genres");

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

exports.validatePassword = [
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("The password field is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password length must be minimum 8 chracters long"),
];

exports.signinValidator = [
  check("email").normalizeEmail().isEmail().withMessage("Email is not valid"),
  check("password").trim().not().isEmpty().withMessage("The password field is required"),
];

exports.actorValidator = [
  check("name").trim().not().isEmpty().withMessage("Actor name is required"),
  check("about").trim().not().isEmpty().withMessage("Actor about is required"),
  check("gender").trim().not().isEmpty().withMessage("Actor gender is required"),
];

exports.validateMovie = [
  check("title").trim().not().isEmpty().withMessage("Movie title is required"),
  check("storyLine").trim().not().isEmpty().withMessage("Movie story line is required"),
  check("language").trim().not().isEmpty().withMessage("Movie language is required"),
  check("releaseDate").isDate().withMessage("Movie release date is required"),
  check("status")
    .isIn(["public", "private"])
    .withMessage("Moie status must be set to public or private"),
  check("genres")
    .isArray()
    .withMessage("Movie genres must be of array type")
    .custom((value) => {
      for (let g of value) {
        if (!genres.includes(g)) throw Error("Invalid genres");
      }

      return true;
    }),
  check("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be an array of strings")
    .custom((value) => {
      for (tag of value) {
        if (typeof tag !== "string") throw Error("Tags must be an array of strings");
      }

      return true;
    }),
  check("cast")
    .isArray()
    .withMessage("Movie cast must be of array object")
    .custom((value) => {
      for (let c of value) {
        if (!isValidObjectId(c.actor)) throw Error("Invalid cast id inside cast");
        if (!c.roleAs?.trim()) throw Error("Cast role is missing");
        if (typeof c.leadActor !== "boolean")
          throw Error("Only boolean value is accepted for cast leadActor field");
      }

      return true;
    }),
];

exports.validateTrailer = check("trailer")
  .isObject()
  .withMessage("Trailer field must be an object of url and public_id")
  .custom(({ url, public_id }) => {
    try {
      const result = new URL(url);

      if (!result.protocol.includes("http")) throw Error("Invalid trailer url");
      console.log(url);
      const arr = url.split("/");
      const publicId = arr[arr.length - 1].split(".")[0];

      const arr2 = public_id.split("/");
      const p_id_arr = arr2[arr2.length - 1];

      if (p_id_arr !== publicId) {
        throw Error("Trailer public_id is missing");
      }
    } catch (error) {
      throw Error(error);
    }

    return true;
  });

exports.validateRatings = check("rating", "Rating must be between 0 and 10.").isFloat({
  min: 0,
  max: 10,
});

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();

  if (error.length) {
    return res.json({ error: error[0].msg });
  }

  next();
};
