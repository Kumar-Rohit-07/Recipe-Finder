// routes/translateRoutes.js
import express from "express";
import { translateText, getCookingTip } from "../controllers/translateController.js";

const router = express.Router();

// ✅ Existing translation route
// POST /api/translate/translate
router.post("/translate", translateText);

// ✅ New: AI Cooking Tip Generator route
// POST /api/translate/tip
router.post("/tip", getCookingTip);

export default router;
