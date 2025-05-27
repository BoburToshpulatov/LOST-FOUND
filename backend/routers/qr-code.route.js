import express from "express";
import {
  generateQRCodes,
  getQRCodeInfo,
  registerQRCode,
  disableQRCode,
} from "../controllers/qrcode.controller.js";
import { isAdmin, authenticateToken } from "../middleware/auth.middleware.js"; // Use both protect and isAdmin

const router = express.Router();

// Admin generates QR codes (protected route)
router.post("/generate", authenticateToken, isAdmin, generateQRCodes); // Only admin can access this route

// Get QR code info (public route)
router.get("/:id", getQRCodeInfo);

// Register QR code (requires authentication)
router.put("/:id/register", authenticateToken, registerQRCode);

// Disable QR code (requires authentication)
router.put("/:id/disable", authenticateToken, disableQRCode);

export default router;
