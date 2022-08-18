const { sendError } = require("../utils/helper");
const cloudinary = require("../cloud");

exports.uploadTrailer = async (req, res) => {
  const { file } = req;

  if (!file) return sendError(res, "Video file is missing");

  const videoRes = await cloudinary.uploader.upload(
    file.path,
    {
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

  res.json(videoRes);
};
