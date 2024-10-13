const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/userRoute");
const mediaRouter = require("./src/routes/mediaRoute");
const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/media", mediaRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Resource not found",
  });
});

module.exports = app;
