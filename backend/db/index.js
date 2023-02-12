const mongoose = require("mongoose");

exports.DBconnection = (app, PORT) => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database is connected");

      app.listen(PORT, () => {
        console.log("Backend server running on port: " + PORT);
      });
    })
    .catch((err) => {
      console.log("Database connection failed: " + err);
    });
};
