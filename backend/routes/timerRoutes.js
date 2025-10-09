// routes/timerRoutes.js
import express from "express";
import { analyzeStep } from "../controllers/timerController.js";

const router = express.Router();

/**
 * POST /api/timer/analyze-step
 * body: { stepText: string, language?: string }
 * returns: { tip, estimated_time (minutes), flame_level, raw }
 */
router.post("/analyze-step", analyzeStep);

export default router;
