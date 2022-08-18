const { isValidObjectId } = require("mongoose");
const { findOne, findById } = require("../models/Actor");
const Actor = require("../models/Actor");
const { sendError } = require("../utils/helper");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

// Create actor
exports.create = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;

  const newActor = new Actor({ name, about, gender });

  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: "MovieMRI",
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
    newActor.avatar = { url: secure_url, public_id };
  }

  await newActor.save();

  res.status(201).json({ id: newActor._id, name, about, gender, avatar: newActor.avatar?.url });
};

// Update actor info
exports.update = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) sendError(res, "Invalid request");

  const actor = await Actor.findById(actorId);

  if (!actor) sendError(res, "Invalid request, record not found", 404);

  const public_id = actor.avatar?.public_id;

  // Remove old image if there is any

  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") sendError("res", "Could not remove old image from cloud");
  }

  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: "MovieMRI",
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
    actor.avatar = { url: secure_url, public_id };
  }

  actor.name = name;
  actor.gender = gender;
  actor.about = about;

  await actor.save();

  res.status(201).json({ id: actor._id, name, about, gender, avatar: actor.avatar?.url });
};
