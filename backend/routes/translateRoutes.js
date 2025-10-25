import express from "express";
import { translateText, getCookingTip } from "../controllers/translateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Translation
router.post("/translate", protect, translateText);

// AI Cooking Tip Generator
router.post("/tip", protect, getCookingTip);

export default router;
