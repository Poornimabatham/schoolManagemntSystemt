const Teacher = require("../models/Teacher");
const Class = require("../models/Class");

// 1. Create a new teacher
const createTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      subject,
      classTeacherOf,
      classesAssigned,
    } = req.body;

    // Check if email already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered." });
    }

    // Generate custom teacherId if not provided (e.g., TCH-1001)
    const count = await Teacher.countDocuments();
    const teacherId = `TCH-${1000 + count + 1}`;

    const teacher = new Teacher({
      teacherId,
      name,
      email,
      phone,
      gender,
      subject,
      classTeacherOf: classTeacherOf || null,
      classesAssigned: classesAssigned || [],
    });

    await teacher.save();

    // If assigned as a class teacher, update the Class document
    if (classTeacherOf) {
      await Class.findByIdAndUpdate(classTeacherOf, {
        classTeacher: teacher._id,
      });
    }

    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get all teachers with filtering and pagination
const getAllTeachers = async (req, res) => {
  try {
    const { status, subject, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { teacherId: { $regex: search, $options: "i" } },
      ];
    }

    const teachers = await Teacher.find(query)
      .populate("classesAssigned", "className section")
      .populate("classTeacherOf", "className section")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Teacher.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get single teacher by ID
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate("classesAssigned", "className section")
      .populate("classTeacherOf", "className section");

    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found." });
    }

    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update teacher details
const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found." });
    }

    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Assign or update Class Teacher role
const assignClassTeacher = async (req, res) => {
  try {
    const { teacherId, classId } = req.body;

    // Remove teacher from previous classTeacherOf role if any
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found." });
    }

    if (teacher.classTeacherOf) {
      await Class.findByIdAndUpdate(teacher.classTeacherOf, {
        classTeacher: null,
      });
    }

    // Update new assignment
    teacher.classTeacherOf = classId;
    await teacher.save();

    await Class.findByIdAndUpdate(classId, { classTeacher: teacher._id });

    res.status(200).json({
      success: true,
      message: "Class teacher assigned successfully.",
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Delete teacher (Soft Delete by default)
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { status: "Inactive" },
      { new: true },
    );

    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found." });
    }

    res.status(200).json({
      success: true,
      message: "Teacher status set to Inactive.",
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const totalTeacherCount = async (req, res) => {
  try {
    const totalStudents = await Teacher.countDocuments();
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
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  assignClassTeacher,
  deleteTeacher,
  totalTeacherCount,
};