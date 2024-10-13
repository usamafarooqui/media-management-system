const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = require("./app");
const mongoose = require("mongoose");
const port = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Couldn't connect to MongoDB");
  });

app.listen(port, () => {
  console.log("App is running on " + port);
});
