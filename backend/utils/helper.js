const crypto = require("crypto");

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
