const Movie = require("../models/Movie");
const Review = require("../models/Review");
const User = require("../models/User");
const { topRatedPipeline, getAverageRating } = require("../utils/helper");

exports.getAppInfo = async (req, res) => {
  const movieCount = await Movie.countDocuments();
  const reviewCount = await Review.countDocuments();
  const userCount = await User.countDocuments();

  res.json({ appInfo: { movieCount, reviewCount, userCount } });
};

exports.getMostRated = async (req, res) => {
  const movies = await Movie.aggregate(topRatedPipeline());

  const mapMovies = async (m) => {
    const reviews = await getAverageRating(m._id);

    return {
      id: m._id,
      title: m.title,
      reviews: { ...reviews },
    };
  };

  const topRatedMovies = await Promise.all(movies.map(mapMovies));

  if (!topRatedMovies.length) {
    return res.json({ movies: null });
  }

  res.json({ movies: topRatedMovies });
};
