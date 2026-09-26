const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Teacher = require("../models/Teacher");
dotenv.config();
const teacherData =
[
  {
    teacherId: "T001",
    name: "Anita Sharma",
    email: "anita.sharma@school.com",
    phone: "9876543210",
    gender: "Female",
    classesAssigned: ["6ab404bc04e96c5804ce1bc8", "6ab404bc04e96c5804ce1bc9"],
    classTeacherOf: "6ab404bc04e96c5804ce1bc8",
    status: "Active",
    joinDate: "2022-06-15T00:00:00.000Z",
  },
  {
    teacherId: "T002",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@school.com",
    phone: "9876543211",
    gender: "Male",
    classesAssigned: ["6ab404bc04e96c5804ce1bca", "6ab404bc04e96c5804ce1bcb"],
    classTeacherOf: "6ab404bc04e96c5804ce1bca",
    status: "Active",
    joinDate: "2021-04-10T00:00:00.000Z",
  },
  {
    teacherId: "T003",
    name: "Priya Nair",
    email: "priya.nair@school.com",
    phone: "9876543212",
    gender: "Female",
    classesAssigned: ["6ab404be04e96c5804ce1bd0", "6ab404c904e96c5804ce1bd9"],
    classTeacherOf: "6ab404be04e96c5804ce1bd0",
    status: "Active",
    joinDate: "2023-01-20T00:00:00.000Z",
  },
  {
    teacherId: "T004",
    name: "Vikram Singh",
    email: "vikram.singh@school.com",
    phone: "9876543213",
    gender: "Male",
    classesAssigned: ["6ab404bc04e96c5804ce1bc9", "6ab404bc04e96c5804ce1bcb"],
    classTeacherOf: null,
    status: "Active",
    joinDate: "2020-08-05T00:00:00.000Z",
  },
  {
    teacherId: "T005",
    name: "Sunita Rao",
    email: "sunita.rao@school.com",
    phone: "9876543214",
    gender: "Female",
    classesAssigned: ["6ab404c904e96c5804ce1bd9"],
    classTeacherOf: "6ab404c904e96c5804ce1bd9",
    status: "Active",
    joinDate: "2019-11-12T00:00:00.000Z",
  },
  {
    teacherId: "T006",
    name: "Arjun Mehta",
    email: "arjun.mehta@school.com",
    phone: "9876543215",
    gender: "Male",
    classesAssigned: ["6ab404bc04e96c5804ce1bc8", "6ab404be04e96c5804ce1bd0"],
    classTeacherOf: null,
    status: "Inactive",
    joinDate: "2018-03-01T00:00:00.000Z",
  },
];
const seedTeachers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Teacher.insertMany(teacherData);
 for (const teacherdata of teacherData) {
      await Teacher.findOneAndUpdate(
        { name: teacherdata.name },
        { $set: teacherdata },
        { upsert: true, new: true }, // creates if not exists, updates if exists
      );
      console.log(`Seeded class: ${teacherdata.name}`);
    }

  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedTeachers();
