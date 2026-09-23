const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // stored as bcrypt hash, never plain text
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "teacher", "student", "parent"],
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      // points to Teacher._id / Student._id / Parent._id
      // null for admin, and null for teacher/student until their profile doc is created
      refPath: "refModel",
    },
    refModel: {
      type: String,
      enum: ["Teacher", "Student", "Parent"],
      default: null,
      // tells Mongoose which collection refId points to (needed for dynamic ref/populate)
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    mustResetPassword: {
      type: Boolean,
      default: false,
      // true when admin creates account with temp password
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }, // adds createdAt, updatedAt automatically
);

module.exports = mongoose.model("User", userSchema);
