const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    teacherId: { type: String, unique: true, trim: true },
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    subject: { type: String, required: true }, // e.g., "Mathematics"
    classesAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    classTeacherOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      default: null,
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    joinDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Teacher", teacherSchema);
