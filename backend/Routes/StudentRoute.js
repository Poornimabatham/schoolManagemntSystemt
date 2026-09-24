const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  statusChange,
} = require("../Controller/studentController");

const useAuth = require("../Middleware/useAuth");
const {
  checkPermission,
  checkClassScope,
} = require("../Middleware/middleware");

// Ensure all endpoints require JWT authentication first
router.use(useAuth);

// 1. GET ALL STUDENTS
// Requires "view_students" permission
router.get("/", checkPermission("students:read:all"), getAllStudents);

// 2. GET SINGLE STUDENT BY ID
// Requires "view_students" permission
router.get("/:id", checkPermission("view_students"), getStudentById);

// 3. CREATE STUDENT
// Requires "create_student" permission AND checks if target class belongs to teacher
router.post(
  "/",
  checkPermission("students:create"),
  checkClassScope,
  createStudent,
);

// 4. UPDATE STUDENT
// Requires "edit_student" permission AND checks class ownership
router.put(
  "/:id",
  checkPermission("students:update:all"),
  checkClassScope,
  updateStudent,
);

// 5. DELETE STUDENT
// Requires "delete_student" permission
router.delete("/:id", checkPermission("students:delete"), deleteStudent);
router.patch(
  "/:id/status",
  checkPermission("students:update:all"),
  statusChange,
);
module.exports = router;
