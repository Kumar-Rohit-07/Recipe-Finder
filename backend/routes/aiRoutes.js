import express from "express";
import { chatWithAI, translateStep } from "../controllers/aiController.js";

const router = express.Router();

// Chat with AI
router.post("/chat", chatWithAI);

// Translate + enrich cooking step
router.post("/translate-step", translateStep);

export default router;
