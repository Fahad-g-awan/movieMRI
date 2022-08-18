const { sendError } = require("../utils/helper");
const cloudinary = require("../cloud");

exports.uploadTrailer = async (req, res) => {
  const { file } = req;

  if (!file) return sendError(res, "Video file is missing");

  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      resource_type: "video",
      folder: "MovieMRI_trailers",
      use_filename: true,
    },
    function (error, result) {
      {
        if (error) console.log(error);
        if (result) return result;
      }
    }
  );

  res.json({ secure_url: url, public_id });
};

exports.createMovie = async (req, res) => {
  const { file, body } = req;

  const {
    title,
    storyLine,
    director,
    realeasDate,
    status,
    type,
    tags,
    genere,
    cast,
    writers,
    poster,
    trailer,
    language,
  } = body;
};
