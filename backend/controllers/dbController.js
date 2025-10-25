// controllers/dbController.js
import fetch from "node-fetch";
import Meal from "../models/dbModels.js";

// ✅ Fetch and save meals by category from TheMealDB
export const syncMealsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    console.log(`🔄 Syncing meals from TheMealDB for category: ${category}`);

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    const data = await response.json();

    if (!data.meals) {
      return res.status(404).json({ message: "No meals found in TheMealDB" });
    }

    const mealDetails = await Promise.all(
      data.meals.map(async (meal) => {
        const mealRes = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        );
        const mealData = await mealRes.json();
        return mealData.meals ? mealData.meals[0] : null;
      })
    );

    const validMeals = mealDetails.filter(Boolean);

    for (const meal of validMeals) {
      await Meal.updateOne(
        { idMeal: meal.idMeal },
        {
          ...meal,
          aiCategory: category.toLowerCase(),
        },
        { upsert: true }
      );
    }

    res.json({ message: `✅ Synced ${validMeals.length} meals for ${category}` });
  } catch (err) {
    console.error("❌ Error syncing meals:", err.message);
    res.status(500).json({ error: "Failed to sync meals" });
  }
};

// ✅ Fetch all meals in DB
export const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meals from DB" });
  }
};
