const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

const dummyUsers = [
  {
    name: "Admin User",
    email: "admin@school.com",
    role: "admin",
    refId: null,
    mustResetPassword: false,
  },
  {
    name: "Rahul Sharma",
    email: "rahul.teacher@school.com",
    role: "teacher",
    refId: null,
    mustResetPassword: true,
  },
  {
    name: "Ananya Verma",
    email: "ananya.student@school.com",
    role: "student",
    refId: null,
    mustResetPassword: true,
  },
  {
    name: "Suresh Verma",
    email: "suresh.parent@gmail.com",
    role: "parent",
    refId: null,
    mustResetPassword: false,
  },
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const hashedPassword = await bcrypt.hash("Test@123", 10);

    for (const u of dummyUsers) {
      await User.findOneAndUpdate(
        { email: u.email },
        { $set: { ...u, password: hashedPassword, isActive: true } },
        { upsert: true, new: true },
      );
      console.log(`Seeded user: ${u.email} (${u.role})`);
    }

    console.log("User seeding completed. Login password for all: Test@123");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedUsers();
