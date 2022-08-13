const express = require("express");
require("./db");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());

app.use("/api/user", userRouter);

app.listen(8000, () => {
  console.log("Backend server running on port: 8000");
});
