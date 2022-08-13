const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/movieMRI")
  .then(() => {
    console.log("Datavase is connected");
  })
  .catch((ex) => {
    console.log("Database connection failed: ex");
  });
