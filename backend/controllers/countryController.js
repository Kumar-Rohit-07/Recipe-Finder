import Meal from "../models/dbModels.js";

// ✅ Fetch dishes based on country and category
export const getDishesByCountry = async (req, res) => {
  try {
    const { country, category = "all" } = req.query;

    // 🛑 Validation
    if (!country) {
      return res.status(400).json({ message: "Country is required." });
    }

    // 🧠 Build query filter
    const filter = { strArea: country };
    if (category !== "all") {
      filter.aiCategory = category;
    }

    // 🔍 Fetch dishes, sorted by avgRating (descending)
    const dishes = await Meal.find(filter).sort({ avgRating: -1 });

    if (!dishes.length) {
      return res.status(404).json({ message: "No dishes found for this selection." });
    }

    // ⭐ Recommended logic
    const recommended = dishes.length > 5 ? dishes.slice(0, 5) : [];

    // ✅ Respond
    res.status(200).json({
      country,
      category,
      totalDishes: dishes.length,
      recommended,
      allDishes: dishes,
    });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Fetch Random Dishes (for default view when "All" is selected)
export const getRandomDishes = async (req, res) => {
  try {
    // Fetch 20 random dishes
    const allDishes = await Meal.aggregate([{ $sample: { size: 20 } }]);

    // Top 5 recommended based on rating
    const recommended = [...allDishes]
      .filter((m) => m.avgRating)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 5);

    res.status(200).json({
      totalDishes: allDishes.length,
      recommended,
      allDishes,
    });
  } catch (error) {
    console.error("Error fetching random dishes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
