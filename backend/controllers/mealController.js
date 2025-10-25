// controllers/mealController.js
import Meal from "../models/dbModels.js";

// ✅ Get meals by category (for frontend cards)
export const getMealsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log("⚡ Backend hit → Fetching meals for category:", category);

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Case-insensitive match for AI-assigned category
    const meals = await Meal.find({
      aiCategory: { $regex: new RegExp(`^${category}$`, "i") },
    });

    console.log("📦 Meals fetched from DB:", meals.length);
    if (!meals.length) {
      return res
        .status(404)
        .json({ message: "No meals found in this category", meals: [] });
    }

    // Directly return avgRating and totalRatings stored in DB
    const formattedMeals = meals.map((meal) => ({
      _id: meal._id,
      idMeal: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.aiCategory,
      ingredients: meal.ingredients || [],
      avgRating: meal.avgRating?.toFixed(1) || "3.0",
      totalRatings: meal.totalRatings || 1,
    }));

    res.json({ meals: formattedMeals });
  } catch (err) {
    console.error("❌ Error fetching meals by category:", err.message);
    res.status(500).json({ message: "Failed to fetch meals by category" });
  }
};

// ✅ Get meal by ID (for detailed recipe page)
// ✅ Get meal by ID (for detailed recipe page)
export const getMealById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📡 Fetching meal by ID:", id);

    let meal;

    // 🧠 Check if id is a valid Mongo ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      meal = await Meal.findById(id);
    }

    // 🟡 If not found or invalid ObjectId → try by idMeal
    if (!meal) {
      meal = await Meal.findOne({ idMeal: id });
    }

    if (!meal) {
      console.log("⚠️ No meal found for ID:", id);
      return res.status(404).json({ message: "Meal not found in database" });
    }

    // 🧹 Clean instructions
    const cleanText = (meal.strInstructions || "")
      .replace(/\r\n/g, "\n")
      .replace(/\n{2,}/g, "\n\n")
      .trim();

    // 🪜 Split into readable steps
    const procedureSteps = cleanText
      ? cleanText
          .split(/\n{2,}|\d+\.\s*|Step\s*\d+[:.\-]?\s*/i)
          .map((p) => p.trim())
          .filter((p) => p.length > 3)
          .map((p, i) => `Step ${i + 1}: ${p}`)
      : [];

    // ✅ Send formatted response
    res.json({
      id: meal._id,
      idMeal: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.aiCategory,
      ingredients: meal.ingredients || [],
      procedure: meal.strInstructions || "",
      procedureSteps,
      avgRating: meal.avgRating?.toFixed(1) || "3.0",
      totalRatings: meal.totalRatings || 1,
      area: meal.strArea,
      youtube: meal.strYoutube,
    });
  } catch (err) {
    console.error("❌ Error fetching meal details:", err.message);
    res.status(500).json({ message: "Failed to fetch meal details" });
  }
};


// ✅ Get all unique AI categories (for dropdowns or filters)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Meal.distinct("aiCategory");
    console.log("📚 Available categories:", categories.length);
    res.json(categories);
  } catch (err) {
    console.error("❌ Error fetching categories:", err.message);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
