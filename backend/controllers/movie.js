const { sendError } = require("../utils/helper");
const cloudinary = require("../cloud");
const Movie = require("../models/Movie");
const { isValidObjectId } = require("mongoose");

// Upload movie trailer
exports.uploadTrailer = async (req, res) => {
  const { file } = req;

  if (!file) return sendError(res, "Video file is missing");

  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      resource_type: "video",
      folder: "MovieMRI/MovieMRI_trailers",
      use_filename: true,
    },
    function (error, result) {
      {
        if (error) console.log(error);
        if (result) return result;
      }
    }
  );

  res.json({ url, public_id });
};

// Create movie
exports.createMovie = async (req, res) => {
  const { file, body } = req;

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    tags,
    genres,
    cast,
    writters,
    trailer,
    language,
  } = body;

  if (cast) {
    for (let c of cast) {
      if (!isValidObjectId(c.actor)) return sendError(res, "Invalid cast id");
    }
  }

  const newMovie = new Movie({
    title,
    storyLine,
    releaseDate,
    status,
    type,
    tags,
    genres,
    cast,
    trailer,
    language,
  });

  if (director) {
    if (!isValidObjectId(director)) return sendError(res, "Invalid director id");
    newMovie.director = director;
  }
  if (writters) {
    for (let writterId of writters) {
      if (!isValidObjectId(writterId)) return sendError(res, "Invalid director id");
    }
    newMovie.writters = writters;
  }

  // Uploading movie poster
  const {
    secure_url: url,
    public_id,
    responsive_breakpoints,
  } = await cloudinary.uploader.upload(
    file.path,
    {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_image: 3,
      },
      folder: "MovieMRI/movie_posters",
      use_filename: true,
    },
    function (error, result) {
      {
        if (error) console.log(error);
        if (result) return result;
      }
    }
  );

  const finalPoster = { url, public_id, responsive: [] };
  const { breakpoints } = responsive_breakpoints[0];

  if (breakpoints.length) {
    for (let imgObg of breakpoints) {
      const secure_url = imgObg;
      finalPoster.responsive.push(secure_url);
    }
  }

  newMovie.poster = finalPoster;
  await newMovie.save();

  res.status(201).json({
    id: newMovie._id,
    title,
  });
};

// Update movie with poster
exports.udateMovieWithPoster = async (req, res) => {
  const { movieId } = req.params;
  const { file } = req;

  if (!file) return sendError(res, "Movie poster is missing");

  if (!isValidObjectId(movieId)) sendError(res, "Invalid movie id");

  const movie = await Movie.findById(movieId);

  if (!movie) sendError(res, "Movie not found", 404);

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    tags,
    genres,
    cast,
    writters,
    trailer,
    language,
  } = req.body;

  if (cast) {
    for (let c of cast) {
      if (!isValidObjectId(c.actor)) return sendError(res, "Invalid cast id");
    }
  }

  movie.title = title;
  movie.tags = tags;
  movie.type = type;
  movie.storyLine = storyLine;
  movie.status = status;
  movie.cast = cast;
  movie.language = language;
  movie.trailer = trailer;
  movie.genres = genres;
  movie.releaseDate = releaseDate;

  if (director) {
    if (!isValidObjectId(director)) return sendError(res, "Invalid director id");
    movie.director = director;
  }
  if (writters) {
    for (let writterId of writters) {
      if (!isValidObjectId(writterId)) return sendError(res, "Invalid director id");
    }
    movie.writters = writters;
  }

  // Updating poster

  const posterId = movie.poster?.public_id;

  // Removing old poster form cloud
  if (posterId) {
    const result = await cloudinary.uploader.destroy(posterId);
    if (result !== "ok") return sendError(res, "Colud not remove poster from cloud");
  }

  await cloudinary.uploader.upload(
    file.path,
    {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_image: 3,
      },
      folder: "MovieMRI/movie_posters",
      use_filename: true,
    },
    function (error, result) {
      {
        if (error) console.log(error);
        if (result) return result;
      }
    }
  );

  const finalPoster = { url, public_id, responsive: [] };
  const { breakpoints } = responsive_breakpoints[0];

  if (breakpoints.length) {
    for (let imgObg of breakpoints) {
      const secure_url = imgObg;
      finalPoster.responsive.push(secure_url);
    }
  }

  movie.poster = finalPoster;

  await movie.save();

  res.status(201).json({ message: "Movie has been update successfully", movie });
};

// Update movie without poster
exports.udateMovieWithoutPoster = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) sendError(res, "Invalid movie id");

  const movie = await Movie.findById(movieId);

  if (!movie) sendError(res, "Movie not found", 404);

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    tags,
    genres,
    cast,
    writters,
    trailer,
    language,
  } = req.body;

  if (cast) {
    for (let c of cast) {
      if (!isValidObjectId(c.actor)) return sendError(res, "Invalid cast id");
    }
  }

  movie.title = title;
  movie.tags = tags;
  movie.type = type;
  movie.storyLine = storyLine;
  movie.status = status;
  movie.cast = cast;
  movie.language = language;
  movie.trailer = trailer;
  movie.genres = genres;
  movie.releaseDate = releaseDate;

  if (director) {
    if (!isValidObjectId(director)) return sendError(res, "Invalid director id");
    movie.director = director;
  }
  if (writters) {
    for (let writterId of writters) {
      if (!isValidObjectId(writterId)) return sendError(res, "Invalid director id");
    }
    movie.writters = writters;
  }
  await movie.save();

  res.status(201).json({ message: "Movie has been update successfully", movie });
};
