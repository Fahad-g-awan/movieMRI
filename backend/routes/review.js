const {
  addReview,
  updateReview,
  removeReview,
  getReviewsByMovie,
} = require("../controllers/reveiw");
const { isAuth } = require("../middlewares/auth");
const { validaRatings, validate } = require("../middlewares/validator");

const router = require("express").Router();

router.post("/add/:movieId", isAuth, validaRatings, validate, addReview);
router.patch("/:reviewId", isAuth, validaRatings, validate, updateReview);
router.delete("/:reviewId", isAuth, removeReview);
router.get("/get-reviews-by-movie/:movieId", getReviewsByMovie);

module.exports = router;
