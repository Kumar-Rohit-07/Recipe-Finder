import Meal from "../models/dbModels.js"; // your existing Meal model
import { filterByAllergies, rankMeals } from "../utils/ingredientsLogic.js";

export const searchMealsByIngredients = async (req, res) => {
  try {
    let { ingredients, aiCategory, allergies } = req.body;

    if (!ingredients) {
      return res.status(400).json({ message: "Please provide ingredients." });
    }

    // Ensure ingredients is an array
    if (!Array.isArray(ingredients)) {
      if (typeof ingredients === "string") {
        ingredients = ingredients.split(",").map((i) => i.trim());
      } else {
        return res.status(400).json({ message: "Ingredients must be an array or comma-separated string." });
      }
    }

    const categoryFilter = aiCategory ? aiCategory.toLowerCase() : "vegetarian";

    // Step 1: Fetch meals filtered by category
    let meals = await Meal.find(
      aiCategory ? { aiCategory: aiCategory.toLowerCase() } : {}
    );


    // Step 2: Exclude meals containing allergens
    meals = filterByAllergies(meals, allergies || []);

    // Step 3: Rank meals based on ingredient matches
    const rankedMeals = rankMeals(meals, ingredients);

    if (rankedMeals.length === 0) {
      return res.status(404).json({ message: "No meals found matching your criteria." });
    }

    res.status(200).json({
      count: rankedMeals.length,
      dishes: rankedMeals, // frontend still expects "dishes"
    });
  } catch (error) {
    console.error("Error in ingredient search:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
