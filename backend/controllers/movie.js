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
    genere,
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
    genere,
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
