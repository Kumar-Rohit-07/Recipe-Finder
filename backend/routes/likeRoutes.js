import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Meal from "../models/dbModels.js";

const router = express.Router();


// ✅ Like a meal (store idMeal directly)
router.post("/like/:mealId", protect, async (req, res) => {
  const { mealId } = req.params;

  const user = await User.findById(req.user._id);

  // Store meal *idMeal* (string) instead of Mongo _id
  if (!user.likedRecipes.includes(mealId)) {
    user.likedRecipes.push(mealId);
    await user.save();
  }

  res.json({ message: "Liked", likedRecipes: user.likedRecipes });
});


// ✅ Unlike a meal
router.delete("/like/:mealId", protect, async (req, res) => {
  const { mealId } = req.params;

  const user = await User.findById(req.user._id);

  user.likedRecipes = user.likedRecipes.filter((id) => id !== mealId);
  await user.save();

  res.json({ message: "Unliked", likedRecipes: user.likedRecipes });
});


// ✅ Return full liked meal objects
router.get("/liked", protect, async (req, res) => {
  const user = await User.findById(req.user._id).lean();

  // Pull actual meal data using idMeal list
  const meals = await Meal.find({ idMeal: { $in: user.likedRecipes } });

  res.json(meals);
});

export default router;
