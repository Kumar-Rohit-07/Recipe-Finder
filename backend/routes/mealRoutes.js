import express from "express";
import { getMealsByCategory } from "../controllers/mealController.js";

const router = express.Router();

// GET /api/meals/:category
router.get("/:category", getMealsByCategory);

export default router;
