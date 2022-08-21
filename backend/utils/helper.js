const crypto = require("crypto");
const cloudinary = require("../cloud");

exports.sendError = (res, error, satatusCode = 401) => {
  res.status(satatusCode).json({ error });
};

exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) return reject(err);

      const buffString = buff.toString("hex");

      resolve(buffString);
    });
  });
};

exports.notFoundHandler = (req, res) => {
  this.sendError(res, "Not Found", 404);
};

exports.uploadImageToCloud = async (file) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file,
    {
      folder: "MovieMRI/movie_actors",
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

  return { url, public_id };
};

exports.formatActor = (actor) => {
  const { _id, name, about, gender, avatar } = actor;
  return { id: _id, name, about, gender, avatar: avatar?.url };
};

exports.parseData = (req, res, next) => {
  const { trailer, cast, writters, genres, tags } = req.body;

  if (trailer) req.body.trailer = JSON.parse(trailer);
  if (cast) req.body.cast = JSON.parse(cast);
  if (writters) req.body.writters = JSON.parse(writters);
  if (genres) req.body.genres = JSON.parse(genres);
  if (tags) req.body.tags = JSON.parse(tags);

  next();
};
