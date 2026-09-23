// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { login } = require("../Controller/authController");
const useAuth = require("../Middleware/useAuth");
const { signup } = require("../Controller/authController");
const User = require("../models/User");
router.post("/login", login);
router.post("/signup", signup);
router.get("/me", useAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});


module.exports = router;
