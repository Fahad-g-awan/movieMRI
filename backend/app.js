const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/error");
const cors = require("cors");
require("dotenv").config();
require("./db");
const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const { notFoundHandler } = require("./utils/helper");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);

app.get("/home", (req, res) => {
  res.json({ ok: "ok" });
});

app.use("/*", notFoundHandler);

app.use(errorHandler);

app.listen(8000, () => {
  console.log("Backend server running on port: 8000");
});
