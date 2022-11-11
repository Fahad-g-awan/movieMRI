const express = require("express");
const {
  uploadTrailer,
  createMovie,
  removeMovie,
  getMovies,
  getMovieForUpdate,
  updateMovie,
  searchMovies,
  getLatestUploads,
  getSingleMovie,
  getRelatedMovies,
  getTopRatedMovies,
} = require("../controllers/movie");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadVideo, uploadImage } = require("../middlewares/multer");
const { validateMovie, validate, validateTrailer } = require("../middlewares/validator");
const { parseData } = require("../utils/helper");

const router = express.Router();

// Routes
router.post("/upload-trailer", isAuth, isAdmin, uploadVideo.single("video"), uploadTrailer);

router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validateTrailer,
  validate,
  createMovie
);

// router.patch(
//   "/update-without-poster/:movieId",
//   isAuth,
//   isAdmin,
//   //   parseData,
//   validateMovie,
//   validate,
//   udateMovieWithoutPoster
// );
router.patch(
  "/update/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  updateMovie
);
router.delete("/delete/:movieId", isAuth, isAdmin, removeMovie);
router.get("/movies", isAuth, isAdmin, getMovies);
router.get("/for-update/:movieId", isAuth, isAdmin, getMovieForUpdate);
router.get("/search", isAuth, isAdmin, searchMovies);

// Routes for normal users

router.get("/latest-upload", getLatestUploads);
router.get("/single/:movieId", getSingleMovie);
router.get("/related/:movieId", getRelatedMovies);
router.get("/top-rated", getTopRatedMovies);

module.exports = router;
