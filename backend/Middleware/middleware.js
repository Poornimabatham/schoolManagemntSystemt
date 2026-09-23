// rbacMiddleware.js
const checkPermission = (requiredPermission) => async (req, res, next) => {
  const { role } = req.user;
  const rolePerms = await RolePermission.findOne({ role });

  if (!rolePerms.permissions.includes(requiredPermission)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
j
// scopeMiddleware.js — runs AFTER rbac, checks data ownership
const checkClassScope = async (req, res, next) => {
  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ userId: req.user.userId });
    if (!teacher.classes.includes(req.body.classId)) {
      return res.status(403).json({ message: "Not your class" });
    }
  }
  next();
};
