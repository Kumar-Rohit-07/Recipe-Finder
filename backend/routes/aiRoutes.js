import express from "express";
import { chatWithAI, translateStep } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Chat with AI
router.post("/chat", protect, chatWithAI);

// Translate + enrich cooking step
router.post("/translate-step", protect, translateStep);

export default router;
