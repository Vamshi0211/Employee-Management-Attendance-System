const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ UPDATED USER SCHEMA (WITH ROLE)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  role: {
    type: String,
    default: "user", // 👈 default user
  },
});

const User = mongoose.model("User", UserSchema);

// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 🔥 check if already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || "user", // 👈 allow admin creation
    });

    await user.save();

    res.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 🔥 SEND CLEAN DATA (IMPORTANT)
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // 🔐 VERY IMPORTANT
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;