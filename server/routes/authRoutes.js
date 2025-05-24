const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

// Register a new user
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(201).json({ msg: "User registered successfully!", token });
    } catch (error) {
      console.error("❌ Registration Error:", error.message);
      res.status(500).json({ msg: "Server error. Please try again later." });
    }
  }
);

// Login a user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ msg: "Login successful!", token });
    } catch (error) {
      console.error("❌ Login Error:", error.message);
      res.status(500).json({ msg: "Server error. Please try again later." });
    }
  }
);

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "No user found with this email" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Save token and expiry to user document
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p>
             <p>Click this <a href="${resetLink}">link</a> to reset your password.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.json({ msg: "Password reset link sent to your email." });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({ msg: "Failed to send reset link." });
  }
});

module.exports = router;
// Compare this snippet from server/models/User.js:
// const mongoose = require("mongoose");