const Student = require("../models/Student");

const getAllStudents = async (req, res) => {
  try {
    const { search, classId, status, page = 1, limit = 10 } = req.query;

    const query = {};

    // If request user is a teacher, restrict results only to their assigned classes
    if (req.user.role === "teacher" && req.teacherClasses) {
      query.classId = { $in: req.teacherClasses };
    } else if (classId && classId !== "All") {
      query.classId = classId;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "All") {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [students, totalStudents] = await Promise.all([
      Student.find(query)
        .populate("classId", "name grade section")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Student.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: students.length,
      totalStudents,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: parseInt(page),
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching students",
      error: error.message,
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("classId");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    // 1. If frontend didn't provide a studentId (or sent an empty string)
    if (!req.body.studentId || req.body.studentId.trim() === "") {
      // Find the last student created sorted by studentId descending
      const lastStudent = await Student.findOne({}, { studentId: 1 })
        .sort({ createdAt: -1 })
        .lean();

      let nextNumber = 1001;

      if (lastStudent && lastStudent.studentId) {
        // Extract the numeric part from "STU-1001" -> 1001
        const lastNum = parseInt(lastStudent.studentId.replace("STU-", ""), 10);
        if (!isNaN(lastNum)) {
          nextNumber = lastNum + 1;
        }
      }

      req.body.studentId = `STU-${nextNumber}`;
    }

    // 2. Create Student
    console.log(req.body, "request");
    const newStudent = await Student.create(req.body);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: newStudent,
    });
  } catch (error) {
    // Handle duplicate key errors (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({
        message: `Student with this ${field} already exists.`,
      });
    }

    res.status(400).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const statusChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log("Status Change Request:", { id, status });
    // Validate status input
    const allowedStatuses = ["Active", "Inactive", "Pending"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    // Update student status in DB
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update status",
    });
  }
};
const totalStudentsCount = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    res.status(200).json({
      success: true,
      count: totalStudents,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching total students",
      error: error.message,
    });
  }
};


module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  statusChange,
    totalStudentsCount,

};
