const Actor = require("../models/Actor");
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
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path);
    newActor.avatar = { url: secure_url, public_id };
  }

  await newActor.save();

  res.status(201).json({ id: newActor._id, name, about, gender, avatar: newActor?.avatar.url });
};
