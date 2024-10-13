const express = require("express");
const { auth } = require("../middlewares/auth");

const userController = require("../controllers/userController");
const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/:id/upgrade", auth, userController.upgradeToCrown);

module.exports = router;
