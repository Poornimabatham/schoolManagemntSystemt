const mongoose = require("mongoose");

const rolePermissionSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true,
      enum: ["admin", "teacher", "student", "parent"],
    },
    permissions: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { timestamps: true }, // adds createdAt, updatedAt automatically
);

module.exports = mongoose.model("RolePermission", rolePermissionSchema);
