// routes/dbRoutes.js
import express from "express";
import { syncMealsByCategory, getAllMeals } from "../controllers/dbController.js";

const router = express.Router();

// 🧩 For syncing from TheMealDB → MongoDB
router.get("/sync/:category", syncMealsByCategory);

// 🧩 For checking all stored meals
router.get("/all", getAllMeals);

export default router;
