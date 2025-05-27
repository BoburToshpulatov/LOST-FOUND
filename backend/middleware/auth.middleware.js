import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../model/user.model.js";

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next(); // If user is admin, proceed to the next middleware or route handler
  } else {
    return res
      .status(403)
      .json({ message: "Access denied, admin privileges required" });
  }
};
