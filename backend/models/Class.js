// Simple Class Schema

const mongoose = require("mongoose");
const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Class 10-A"
  grade: { type: String, required: true }, // e.g., "10"
  section: { type: String, required: true }, // e.g., "A"
});

module.exports = mongoose.model("Class", classSchema);
