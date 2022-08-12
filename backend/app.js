const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(8000, (req, res) => {
  console.log("Backend server running on port: 8000");
});
