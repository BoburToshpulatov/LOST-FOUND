import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: { type: String, required: true },
    backupPhone: { type: String, required: true },
    name: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: {
      code: String,
      expiresAt: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Can be either 'user' or 'admin'
      default: "user", // Default role
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
