const { isValidObjectId } = require("mongoose");
const Movie = require("../models/Movie");
const Review = require("../models/Review");
const { sendError } = require("../utils/helper");

exports.addReview = async (req, res) => {
  const { movieId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie!");

  const movie = await Movie.findOne({ _id: movieId, status: "public" });
  if (!movie) return sendError(res, "Movie not found", 404);

  const isAlreadyReviewed = await Review.findOne({ owner: userId, parentMovie: movie._id });

  if (isAlreadyReviewed)
    return sendError(res, "Invalid request, review already made for this movie");

  const newReview = new Review({
    owner: userId,
    parentMovie: movie._id,
    content,
    rating,
  });

  // Updating review for movie
  movie.reviews.push(newReview._id);
  await movie.save();

  // Saving new review
  await newReview.save();

  res.json({ message: "Your review has been successfully added." });
};

exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid reveiw id!");

  const review = await Review.findOne({ owner: userId, _id, reviewId });
  if (!review) return sendError(res, "Reveiw not found!", 404);

  review.content = content;
  review.rating = rating;

  await review.save();

  res.json({ message: "your review has been updated" });
};

exports.removeReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.use._id;

  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid review Id");

  const review = await Review.findOne({ _id: reviewId, owner: userId });
  if (!review) return sendError(res, "Invalid request, review not found");

  const movie = await Movie.findById(review.paraentMovie).select("reviews");

  movie.reviews = movie.reviews.filter((rId) => rId.toString() !== reviewId);

  await Review.findByIdAndDelete(reviewId);
  await movie.save();

  res.json({ message: "Review removed successfully" });
};

exports.getReviewsByMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie Id");

  const movie = await Movie.findById(movieId)
    .populate({
      path: "review",
      populate: {
        path: "owner",
        select: "name",
      },
    })
    .select("reviews");

  const reviews = movie.reviews.map((r) => {
    const { owner, content, rating, _id: reviewId } = r;
    const { name, _id: ownerId } = owner;

    return {
      id: reviewId,
      owner: {
        ownerId,
        name: name,
      },
      content,
      rating,
    };
  });

  res.json({ reviews });
};
