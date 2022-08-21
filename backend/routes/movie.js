const express = require("express");
const {
  uploadTrailer,
  createMovie,
  udateMovieWithoutPoster,
  removeMovie,
} = require("../controllers/movie");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadVideo, uploadImage } = require("../middlewares/multer");
const { validateMovie, validate } = require("../middlewares/validator");
const { parseData } = require("../utils/helper");

const router = express.Router();

router.post("/upload-trailer", isAuth, isAdmin, uploadVideo.single("video"), uploadTrailer);
router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  createMovie
);
router.patch(
  "/update-without-poster/:movieId",
  isAuth,
  isAdmin,
  //   parseData,
  validateMovie,
  validate,
  udateMovieWithoutPoster
);
router.patch(
  "/update-with-poster/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  //   validateMovie,
  //   validate,
  udateMovieWithoutPoster
);
router.delete("/delete/:movieId", isAuth, isAdmin, removeMovie);

module.exports = router;
