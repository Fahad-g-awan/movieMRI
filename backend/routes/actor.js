const express = require("express");
const { create } = require("../controllers/actor");
const { uploadImage } = require("../middlewares/multer");
const { actorValidator, validate } = require("../middlewares/validator");

const router = express.Router();

router.post("/create", uploadImage.single("avatar"), actorValidator, validate, create);

module.exports = router;
