import express from "express";
import {
  addOrUpdateRating,
  getAverageRating,
  getTopRatedDishes,
  checkIfUserRated,
} from "../controllers/ratingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ⭐ Add or update rating (protected)
router.post("/", protect, addOrUpdateRating);

// ⭐ Get average rating for a meal
router.get("/average/:mealId", getAverageRating);

// ⭐ Get top 5 rated dishes
router.get("/top", getTopRatedDishes);

// ⭐ Check if current user rated a specific dish (protected)
router.get("/user/:mealId", protect, checkIfUserRated);

export default router;
