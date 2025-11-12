// routes/communityRecipeRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload, createRecipe, getAllRecipes, getRecipe } from "../controllers/communityRecipeController.js";

const router = express.Router();

// POST /api/community/recipes
router.post("/", protect, upload.single("image"), createRecipe);

// GET /api/community/recipes
router.get("/", getAllRecipes);

// GET /api/community/recipes/:id
router.get("/:id", getRecipe);

export default router;
