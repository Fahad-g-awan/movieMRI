const crypto = require("crypto");
const cloudinary = require("../cloud");
const Review = require("../models/Review");

exports.sendError = (res, error, satatusCode = 401) => {
  res.status(satatusCode).json({ error });
};

exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) return reject(err);

      const buffString = buff.toString("hex");

      resolve(buffString);
    });
  });
};

exports.notFoundHandler = (req, res) => {
  this.sendError(res, "Route/URL not Found", 404);
};

exports.uploadImageToCloud = async (file) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file,
    {
      folder: "MovieMRI/movie_actors",
      use_filename: true,
    },
    function (error, result) {
      {
        if (error) console.log(error);
        if (result) return result;
      }
    },
    {
      gravity: "face",
      height: 150,
      width: 150,
      crop: "thumb",
    }
  );

  return { url, public_id };
};

exports.formatActor = (actor) => {
  const { _id, name, about, gender, avatar } = actor;
  return { id: _id, name, about, gender, avatar: avatar?.url };
};

exports.parseData = (req, res, next) => {
  const { trailer, cast, writers, genres, tags } = req.body;

  if (trailer) req.body.trailer = JSON.parse(trailer);
  if (cast) req.body.cast = JSON.parse(cast);
  if (writers) req.body.writers = JSON.parse(writers);
  if (genres) req.body.genres = JSON.parse(genres);
  if (tags) req.body.tags = JSON.parse(tags);

  next();
};

exports.avgRatingPipeline = (movieId) => {
  return [
    {
      $lookup: {
        from: "Review",
        localField: "rating",
        foreignField: "_id",
        as: "avgRat",
      },
    },
    {
      $match: {
        parentMovie: movieId,
      },
    },
    {
      $group: {
        _id: null,
        ratingAvg: {
          $avg: "$rating",
        },
        reviewCount: {
          $sum: 1,
        },
      },
    },
  ];
};

exports.relatedMovieAggregation = (tags, movieId) => {
  return [
    {
      $lookup: {
        from: "Movie",
        localField: "tags",
        foreignField: "_id",
        as: "relatedMovies",
      },
    },
    {
      $match: {
        tags: { $in: [...tags] },
        _id: { $ne: movieId },
      },
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
      },
    },
    {
      $limit: 5,
    },
  ];
};

exports.topRatedPipeline = (type) => {
  const matchedOptions = {
    reviews: { $exists: true, $ne: [] },
    status: { $eq: "public" },
  };

  if (type) {
    matchedOptions.type = { $eq: type };
    matchedOptions.reviews = { $exists: true };
  }

  return [
    {
      $lookup: {
        from: "Movie",
        localField: "reviews",
        foreignField: "_id",
        as: "topRated",
      },
    },
    {
      $match: matchedOptions,
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    {
      $limit: 5,
    },
  ];
};

exports.getAverageRating = async (movieId) => {
  const [aggregatedResponse] = await Review.aggregate(this.avgRatingPipeline(movieId));

  const reviews = {};

  if (aggregatedResponse) {
    const { ratingAvg, reviewCount } = aggregatedResponse;

    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.reviewsCount = reviewCount;
  }

  return reviews;
};

exports.genresPipeline = (genres) => {
  const matchedOptions = {
    reviews: { $exists: true, $ne: [] },
    status: { $eq: "public" },
  };

  if (genres) {
    matchedOptions.genres = { $eq: genres };
    matchedOptions.reviews = { $exists: true };
  }

  return [
    {
      $lookup: {
        from: "Movie",
        localField: "reviews",
        foreignField: "_id",
        as: "topRated",
      },
    },
    {
      $match: matchedOptions,
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    {
      $limit: 5,
    },
  ];
};
