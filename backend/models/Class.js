const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // fixed typo here
  grade: { type: String, required: true },
  section: { type: String, required: true },

  // one class-in-charge teacher (one-to-one, back-reference)
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    default: null,
  },
});

module.exports = mongoose.model("Class", classSchema);
