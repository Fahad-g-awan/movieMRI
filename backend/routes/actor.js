const express = require("express");
const { create, update, remove } = require("../controllers/actor");
const { uploadImage } = require("../middlewares/multer");
const { actorValidator, validate } = require("../middlewares/validator");

const router = express.Router();

router.post("/create", uploadImage.single("avatar"), actorValidator, validate, create);
router.post("/update/:actorId", uploadImage.single("avatar"), actorValidator, validate, update);
router.delete("/remove/:actorId", remove);

module.exports = router;
