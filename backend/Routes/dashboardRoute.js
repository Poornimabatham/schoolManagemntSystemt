const express = require("express");
const router = express.Router();

const { totalStudentsCount } = require("../Controller/studentController");

const useAuth = require("../Middleware/useAuth");
const {
  checkPermission,
  checkClassScope,
} = require("../Middleware/middleware");

router.use(useAuth);//
// GET request for the dashboard
router.get("/count", checkPermission("dashboard:read:all"), totalStudentsCount);

module.exports = router;
