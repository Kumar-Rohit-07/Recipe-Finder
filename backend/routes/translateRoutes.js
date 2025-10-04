// routes/translateRoutes.js
import express from "express";
import { translateText } from "../controllers/translateController.js";

const router = express.Router();

// POST /api/translate
router.post("/translate", translateText);

export default router;
