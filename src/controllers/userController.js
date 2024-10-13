const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: "User registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

exports.upgradeToCrown = async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to upgrade this account" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "crown") {
      return res
        .status(400)
        .json({ error: "Account is already upgraded to crown" });
    }

    user.role = "crown";
    await user.save();

    res.json({ message: "Account upgraded to crown successfully" });
  } catch (err) {
    res.status(500).json({ error: "Account upgrade failed" });
  }
};
