require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const StudentRoutes = require("./Routes/StudentRoute");
const classRoutes = require("./Routes/classRoute");
const dashboard = require("./Routes/dashboardRoute")
const teacher = require("./Routes/teacherRoute")
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/student", StudentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/dashbaord", dashboard);
app.use("/api/teacher", teacher);


const PORT = process.env.PORT || 5000;

// Connect to MongoDB FIRST, then start listening
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });
