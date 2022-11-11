const {
  addReview,
  updateReview,
  removeReview,
  getReviewsByMovie,
} = require("../controllers/reveiw");
const { isAuth } = require("../middlewares/auth");
const { validate, validateRatings } = require("../middlewares/validator");

const router = require("express").Router();

router.post("/add/:movieId", isAuth, validateRatings, validate, addReview);
router.patch("/:reviewId", isAuth, validateRatings, validate, updateReview);
router.delete("/:reviewId", isAuth, removeReview);
router.get("/get-reviews-by-movie/:movieId", getReviewsByMovie);

module.exports = router;
