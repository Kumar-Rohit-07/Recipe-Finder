// controllers/communityRecipeController.js
import CommunityRecipe from "../models/CommunityRecipe.js";
import multer from "multer";
import path from "path";

// Image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/community-recipes/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
export const upload = multer({ storage });

// Create Recipe
export const createRecipe = async (req, res) => {
  try {
    const { name, category, country, ingredients, steps, videoLink } = req.body;

    const recipeDoc = await CommunityRecipe.create({
      name,
      category,
      country,
      ingredients: JSON.parse(ingredients).map((i) => ({
        ingredient: i.name,
        measure: i.measure,
      })),
      steps: JSON.parse(steps).filter((s) => s.trim() !== ""), // avoid empty steps
      videoLink,
      image: `/uploads/community-recipes/${req.file.filename}`,
      user: req.user._id,
    });

    // ✅ Return populated recipe with user's name and profilePic
    const fullRecipe = await CommunityRecipe.findById(recipeDoc._id)
      .populate("user", "name profilePic");

    res.json(fullRecipe);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating recipe" });
  }
};

// ✅ Get all recipes
export const getAllRecipes = async (req, res) => {
  const recipes = await CommunityRecipe.find()
    .populate("user", "name profilePic") // ✅ fixed here
    .sort({ createdAt: -1 });
  res.json(recipes);
};

// ✅ Get single recipe
export const getRecipe = async (req, res) => {
  const recipe = await CommunityRecipe.findById(req.params.id)
    .populate("user", "name profilePic"); // ✅ fixed here
  res.json(recipe);
};
