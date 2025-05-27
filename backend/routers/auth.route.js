import { Router } from "express";
import {
  getProfile,
  registerUser,
  requestLogin,
  resendVerificationCode,
  updateProfile,
  verifyEmail,
  verifyLoginCode,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendVerificationCode);
router.post("/login", requestLogin);
router.post("/verify-login", verifyLoginCode);
router.get("/profile", authenticateToken, getProfile);
router.put("/update", authenticateToken, updateProfile);

export default router;
