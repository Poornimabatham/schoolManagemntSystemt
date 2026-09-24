const express = require("express");
const router = express.Router();
const { getAllClasses } = require("../Controller/classController");

// Base URL: /api/classes
// Optional: Add `protect` middleware if authentication is required
router.get("/", getAllClasses);

module.exports = router;
