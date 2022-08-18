const express = require("express");
const {
  createActor,
  updateActor,
  removeActor,
  searchActor,
  getLatestActors,
  getSingleActor,
} = require("../controllers/actor");
const { uploadImage } = require("../middlewares/multer");
const { actorValidator, validate } = require("../middlewares/validator");

const router = express.Router();

router.post("/create", uploadImage.single("avatar"), actorValidator, validate, createActor);
router.post(
  "/update/:actorId",
  uploadImage.single("avatar"),
  actorValidator,
  validate,
  updateActor
);
router.delete("/remove/:actorId", removeActor);
router.get("/search", searchActor);
router.get("/latest-uploads", getLatestActors);
router.get("/single/:actorId", getSingleActor);

module.exports = router;
