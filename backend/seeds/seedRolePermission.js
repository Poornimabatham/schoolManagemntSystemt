const mongoose = require("mongoose");
const RolePermission = require("../models/RolePermission");
require("dotenv").config();

const rolePermissionsData = [
  {
    role: "admin",
    permissions: [
      "dashboard:read:all",
      "students:create",
      "students:read:all",
      "students:update:all",
      "students:delete",
      "teachers:create",
      "teachers:read:all",
      "teachers:update:all",
      "teachers:delete",
      "classes:create",
      "classes:read:all",
      "classes:update:all",
      "classes:delete",
      "subjects:create",
      "subjects:read:all",
      "subjects:update:all",
      "subjects:delete",
      "attendance:read:all",
      "attendance:update:all",
      "fees:create",
      "fees:read:all",
      "fees:update:all",
      "homework:read:all",
      "timetable:create",
      "timetable:read:all",
      "timetable:update:all",
      "notice:create",
      "notice:read:all",
      "notice:delete",
      "reports:generate:all",
      "roles:create",
      "roles:update",
      "roles:delete",
      "exams:create",
      "exams:read:all",
      "exams:update:all",
      "materials:read:all",
      "materials:delete",
      "ai_assistant:query:all",
    ],
  },
  {
    role: "teacher",
    permissions: [
      "dashboard:read:own-class",
      "students:read:own-class",
      "classes:read:own-class",
      "subjects:read:own-subject",
      "subjects:update:own-subject",
      "attendance:read:own-class",
      "attendance:write:own-class",
      "homework:create:own-subject",
      "homework:read:own-subject",
      "homework:update:own-subject",
      "homework:grade:own-subject",
      "timetable:read:own",
      "notice:create:own-class",
      "notice:read:own",
      "reports:generate:own-class",
      "exams:create:own-subject",
      "exams:read:own-subject",
      "exams:enterMarks:own-subject",
      "materials:create:own-subject",
      "materials:read:own-subject",
      "materials:update:own-subject",
      "ai_assistant:query:own-scope",
    ],
  },
  {
    role: "student",
    permissions: [
      "dashboard:read:own",
      "students:read:own",
      "students:update:own-profile",
      "classes:read:own",
      "subjects:read:own-class",
      "attendance:read:own",
      "fees:read:own",
      "homework:read:own-class",
      "homework:submit:own",
      "timetable:read:own",
      "notice:read:own",
      "reports:read:own",
      "exams:read:own",
      "materials:read:own-class",
      "ai_assistant:query:own",
    ],
  },
  {
    role: "parent",
    permissions: [
      "dashboard:read:child",
      "students:read:child",
      "attendance:read:child",
      "fees:read:child",
      "fees:pay:child",
      "homework:read:child",
      "timetable:read:child",
      "notice:read:own",
      "reports:read:child",
      "exams:read:child",
      "materials:read:child",
      "ai_assistant:query:child-scope",
    ],
  },
];

async function seedRolePermissions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    for (const roleData of rolePermissionsData) {
      await RolePermission.findOneAndUpdate(
        { role: roleData.role },
        { $set: { permissions: roleData.permissions } },
        { upsert: true, new: true }, // creates if not exists, updates if exists
      );
      console.log(`Seeded permissions for role: ${roleData.role}`);
    }

    console.log("Role permissions seeding completed.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedRolePermissions();
