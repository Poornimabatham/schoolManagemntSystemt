

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ClassModel = require("../models/Class");
dotenv.config();


const classesData = [
  { name: "Class 9-A", grade: "9", section: "A" },
  { name: "Class 9-B", grade: "9", section: "B" },
  { name: "Class 10-A", grade: "10", section: "A" },
  { name: "Class 10-B", grade: "10", section: "B" },
  { name: "Class 11-A", grade: "11", section: "A" },
  { name: "Class 12-A", grade: "12", section: "A" },
];


async function seedClasses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    for (const classData of classesData) {
      await ClassModel.findOneAndUpdate(
        { name: classData.name },
        { $set: classData },
        { upsert: true, new: true }, // creates if not exists, updates if exists
      );
      console.log(`Seeded class: ${classData.name}`);
    }

    console.log("Class seeding completed.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedClasses();
