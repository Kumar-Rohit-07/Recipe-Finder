// routes/mealRoutes.js
import express from "express";
import {
  getMealsByCategory,
  getMealById,
  getAllCategories,
} from "../controllers/mealController.js";

const router = express.Router();

// 📦 Get all categories for frontend dropdowns
router.get("/categories", getAllCategories);

// 📦 Get meals by category
router.get("/category/:category", getMealsByCategory);

// 📦 Get meal by ID
router.get("/:id", getMealById);

export default router;
