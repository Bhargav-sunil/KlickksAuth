const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { validateGmail } = require("../utils/emailValidator");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailValidation = validateGmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ error: emailValidation.message });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      function (err) {
        if (err) {
          return res.status(400).json({ error: "Email already exists" });
        }
        res.status(201).json({ message: "User created successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const emailValidation = validateGmail(email);
  if (!emailValidation.isValid) {
    return res.status(400).json({ error: emailValidation.message });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user.id;
    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email },
    });
  });
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
});

// Auth status
router.get("/status", (req, res) => {
  if (req.session.userId) {
    db.get(
      "SELECT id, email FROM users WHERE id = ?",
      [req.session.userId],
      (err, user) => {
        if (err || !user) {
          return res.status(401).json({ isAuthenticated: false });
        }
        res.json({ isAuthenticated: true, user });
      }
    );
  } else {
    res.json({ isAuthenticated: false });
  }
});

module.exports = router;
