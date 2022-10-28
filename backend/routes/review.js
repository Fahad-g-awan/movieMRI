const { addReview } = require("../controllers/reveiw");
const { isAuth } = require("../middlewares/auth");
const { validaRatings, validate } = require("../middlewares/validator");

const router = require("express").Router();

router.get("/add/:movieId", isAuth, validaRatings, validate, addReview);

module.exports = router;
