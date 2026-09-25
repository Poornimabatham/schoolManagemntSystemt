const mongoose = require("mongoose");

const Class = require("../models/Class");
const getAllClasses = async (req, res) => {
  try {
    const { grade } = req.query;
    const query = {};

    if (grade && grade !== "All") {
      query.grade = grade;
    }

    const classes = await Class.find(query).sort({ grade: 1, section: 1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch classes",
      error: error.message,
    });
  }
};

const totalClasses = async (req, res) => {
  try {
    const totalClasses = await Class.countDocuments();
    res.status(200).json({
      success: true,
      count: totalClasses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching total classes",
      error: error.message,
    });
  }
}

module.exports = { getAllClasses, totalClasses };
