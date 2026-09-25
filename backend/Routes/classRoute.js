const express = require("express");
const router = express.Router();
const {
  getAllClasses,
  totalClasses,
} = require("../Controller/classController");
const useAuth = require("../Middleware/useAuth");
const {
  checkPermission,
  checkClassScope,
} = require("../Middleware/middleware");
router.use(useAuth); //

// Base URL: /api/classes
// Optional: Add `protect` middleware if authentication is required
router.get("/", checkPermission("classes:read:all"), getAllClasses);
router.get("/count", checkPermission("classes:read:all"), totalClasses);

module.exports = router;
