import express from "express";
import { searchMealsByIngredients } from "../controllers/ingredientController.js";

const router = express.Router();

router.post("/search", searchMealsByIngredients);

export default router;
