const express = require("express");
const multer = require("multer");
const router = express.Router();
const { auth, adminAuth } = require("../middlewares/auth");
const mediaController = require("../controllers/mediaController");
const upload = require("../middlewares/upload");

router.get("/admin/media", auth, adminAuth, mediaController.listAllMedia); // List all users' media
router.delete(
  "/admin/media/:id",
  auth,
  adminAuth,
  mediaController.deleteAnyMedia
);

router.post("/upload", auth, (req, res) => {
  upload.single("media")(req, res, (err) => {
    if (err) {
      const errorMessage =
        err instanceof multer.MulterError
          ? err.message
          : err.message === "Invalid file type"
          ? "Invalid file type. Only JPEG, PNG, and MP4 files are allowed."
          : "An unknown error occurred during file upload.";

      return res.status(400).json({ error: errorMessage });
    }
    // Proceed to the upload controller
    mediaController.upload(req, res);
  });
});

router.get("/remaining-storage", auth, mediaController.getRemainingStorage);

router.get("/", auth, mediaController.listMedia);

router.get("/:id", auth, mediaController.getMedia);

router.delete("/:id", auth, mediaController.deleteMedia);

module.exports = router;
