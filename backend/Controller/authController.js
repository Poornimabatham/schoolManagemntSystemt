// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Explicitly fetch password while keeping query lightweight using .lean()
    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+password")
      .lean();

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, refId: user.refId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Exclude password from output
    delete user.password;

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mustResetPassword: user.mustResetPassword,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error during login" });
  }
};
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!["admin", "teacher", "student", "parent"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    // const token = generateToken(user);
    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { login, signup };
