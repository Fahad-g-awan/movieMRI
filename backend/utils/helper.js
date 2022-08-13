exports.sendError = (res, error, satatusCode = 401) => {
  res.status(satatusCode).json({ error });
};
