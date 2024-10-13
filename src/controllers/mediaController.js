const Media = require("../models/Media");
const User = require("../models/User");
const fs = require("fs");

exports.listAllMedia = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalMedia = await Media.countDocuments();
    const totalPages = Math.ceil(totalMedia / limit);

    const mediaFiles = await Media.find().skip(skip).limit(limit).exec();

    res.json({
      currentPage: page,
      totalPages,
      mediaFiles,
    });
  } catch (err) {
    res.status(500).json({ error: "Unable to retrieve media files" });
  }
};

exports.deleteAnyMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ error: "Media file not found" });
    }

    if (fs.existsSync(media.filePath)) {
      fs.unlinkSync(media.filePath);
    } else {
      return res.status(404).json({ error: "File not found on the server" });
    }

    await Media.findByIdAndDelete(req.params.id);

    const user = await User.findById(media.user);
    if (user) {
      user.storageUsed -= media.size;
      if (user.storageUsed < 0) user.storageUsed = 0; // Ensure no negative value
      await user.save();
    }

    res.json({ message: "Media file deleted successfully by admin" });
  } catch (err) {
    res.status(500).json({ error: "Unable to delete media file" });
  }
};

exports.upload = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const fileSize = req.file.size;

    const totalStorageLimit =
      user.role === "crown" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (user.storageUsed + fileSize > totalStorageLimit) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Storage limit exceeded" });
    }

    const media = new Media({
      user: req.user.id,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      size: req.file.size,
    });
    await media.save();

    user.storageUsed += fileSize;
    await user.save();

    res.json({ message: "File uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: "Media upload failed" });
  }
};

exports.listMedia = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const mediaFiles = await Media.find({ user: req.user.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Media.countDocuments({ user: req.user.id });

    res.json({
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      mediaFiles,
    });
  } catch (err) {
    res.status(500).json({ error: "Unable to list media files" });
  }
};

exports.getMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    console.log(media);
    if (!media || media.user.toString() !== req.user.id) {
      return res.status(404).json({ error: "Media file not found" });
    }

    res.sendFile(media.filePath, { root: "." }); // Serve the file
  } catch (err) {
    res.status(500).json({ error: "Unable to retrieve media file" });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media || media.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Media file not found or access denied" });
    }

    if (fs.existsSync(media.filePath)) {
      fs.unlinkSync(media.filePath);
    } else {
      return res.status(404).json({ error: "File not found on the server" });
    }

    await Media.findByIdAndDelete(req.params.id);

    const user = await User.findById(req.user.id);
    if (user) {
      user.storageUsed -= media.size;
      if (user.storageUsed < 0) user.storageUsed = 0; // Ensure no negative value
      await user.save();
    }

    res.json({ message: "Media file deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Unable to delete media file" });
  }
};

exports.getRemainingStorage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const totalStorageLimit =
      user.role === "crown" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    const remainingStorageInBytes = totalStorageLimit - user.storageUsed;
    const remainingStorageInMB = (
      remainingStorageInBytes /
      (1024 * 1024)
    ).toFixed(2);

    res.json({ remainingStorage: `${remainingStorageInMB} MB` });
  } catch (err) {
    console.log("hello ");
    res.status(500).json({ error: "Unable to retrieve remaining storage" });
  }
};
