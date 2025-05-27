import express from "express";
import {
  getReport,
  getUserUnconfirmedReports,
  submitReport,
} from "../controllers/foundReport.controller.js";
import { confirmFound } from "../controllers/reward.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/all-reports", authenticateToken, getUserUnconfirmedReports);
router.post("/:qrId", submitReport);
router.get("/:id", authenticateToken, getReport);
router.post("/:id/confirm", authenticateToken, confirmFound);

export default router;
