const { isValidObjectId } = require("mongoose");
const Actor = require("../models/Actor");
const { sendError, uploadImageToCloud, formatActor } = require("../utils/helper");
const cloudinary = require("../cloud");

// ########## Create actor
exports.createActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;

  const newActor = new Actor({ name, about, gender });

  // Upload new image to cloud
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    newActor.avatar = { url, public_id };
  }

  await newActor.save();

  res.status(201).json({ actor: formatActor(newActor) });
};

// ########## Update actor info
exports.updateActor = async (req, res) => {
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

  // Upload new image to cloud
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    actor.avatar = { url, public_id };
  }

  actor.name = name;
  actor.gender = gender;
  actor.about = about;

  await actor.save();

  res.status(201).json(formatActor(actor));
};

// ########## Delete an actor
exports.removeActor = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) sendError(res, "Invalid request.");

  const actor = await Actor.findById(actorId);

  if (!actor) sendError(res, "Invalid request, record not found.", 404);

  const public_id = actor.avatar?.public_id;

  // Remove old image if there is any

  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") sendError("res", "Could not remove old image from cloud.");
  }

  await Actor.findByIdAndDelete(actorId);

  res.json({ message: "Record removed successfully." });
};

// ########## Search an actor
exports.searchActor = async (req, res) => {
  const { query } = req;

  const result = await Actor.find({ $text: { $search: `"${query.name}"` } });

  const actors = result.map((actor) => formatActor(actor));

  res.json({ results: actors });
};

// ########## Get all latest actor uploaded
exports.getLatestActors = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: -1 }).limit(12);

  const actors = result.map((actor) => formatActor(actor));

  res.json(actors);
};

// Get single actor
exports.getSingleActor = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) sendError(res, "Invalid request.");

  const actor = await Actor.findById(actorId);

  if (!actor) sendError(res, "Invalid request, record not found.", 404);

  res.json(formatActor(actor));
};

exports.getActors = async (req, res) => {
  const { pageNo = 0, limit = 10 } = req.query;

  const actors = await Actor.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit));

  const profiles = actors.map((actor) => formatActor(actor));

  res.json({ profiles });
};
