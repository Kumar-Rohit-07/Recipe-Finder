import express from "express";
import { getMealsByCategory, getMealById } from "../controllers/mealController.js";

const router = express.Router();

// ✅ Get meals by category
router.get("/category/:category", getMealsByCategory);

// ✅ Get a single meal by ID
router.get("/meal/:id", getMealById);

export default router;
