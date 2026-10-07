import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const makeToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", validate("register"), async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
    token: makeToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

router.post("/login", validate("login"), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  res.json({
    token: makeToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

router.put("/change-password", protect, validate("changePassword"), async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
});

export default router;
