const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  size: { type: Number, required: true }, // in bytes
});

const Media = mongoose.model("Media", MediaSchema);
module.exports = Media;