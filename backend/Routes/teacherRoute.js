const express = require("express");
const router = express.Router();
const {
  totalTeacherCount,
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  assignClassTeacher,
  deleteTeacher,
} = require("../Controller/teacherController");
const useAuth = require("../Middleware/useAuth");
const {
  checkPermission,
  checkClassScope,
} = require("../Middleware/middleware");
router.use(useAuth); //

// Base URL: /api/classes
// Optional: Add `protect` middleware if authentication is required
router.get("/", checkPermission("teachers:read:all"), getAllTeachers);
router.get("/count", checkPermission("teachers:read:all"), totalTeacherCount);
router.post("/createTeacher", checkPermission("teachers:create"), createTeacher);

module.exports = router;
