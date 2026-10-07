import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
  } catch {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    throw error;
  }

  req.user = await User.findById(decoded.id).select("-password");
  if (!req.user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }
  next();
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    const error = new Error("Admin access required");
    error.statusCode = 403;
    return next(error);
  }
  next();
}
