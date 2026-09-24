const RolePermission = require("../models/RolePermission");

// RBAC Middleware
const checkPermission = (requiredPermission) => async (req, res, next) => {
  try {
    if (!req.user || !req.user.role) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User info missing" });
    }

    const rolePerms = await RolePermission.findOne({ role: req.user.role });

    console.log(
      req.user.role,
      rolePerms,
      rolePerms.permissions,
      requiredPermission,
    );

    // Check if role exist and has permissions array
    if (!rolePerms || !rolePerms.permissions.includes(requiredPermission)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Server error checking permissions",
      error: error.message,
    });
  }
};

// Scope Middleware — Checks class ownership for Teachers
const checkClassScope = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "teacher") {
      // Support classId from body (POST/PUT), query (GET), or params
      const classId =
        req.body.classId || req.query.classId || req.params.classId;

      if (!classId) {
        return res
          .status(400)
          .json({ message: "Class ID is required for scope verification" });
      }

      const teacher = await Teacher.findOne({ userId: req.user.userId });

      if (!teacher) {
        return res.status(404).json({ message: "Teacher record not found" });
      }

      // Ensure classId is compared safely (handling strings vs MongoDB ObjectIds)
      const hasClassAccess = teacher.classes.some(
        (cls) => cls.toString() === classId.toString(),
      );

      if (!hasClassAccess) {
        return res
          .status(403)
          .json({ message: "Access denied: Not your assigned class" });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Server error checking class scope",
      error: error.message,
    });
  }
};

module.exports = { checkPermission, checkClassScope };
