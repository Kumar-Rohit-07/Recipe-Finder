import fetch from "node-fetch";

export const getMealsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Map categories to correct API sources
    const categoryMap = {
      "vegetarian": { type: "meal", value: "Vegetarian" },
      "non-veg": { type: "meal", value: "Chicken" },
      "desserts": { type: "meal", value: "Dessert" },
      "drinks": { type: "drink", value: "Cocktail" }, // ✅ use Cocktail (always returns data)
    };

    const selected = categoryMap[category.toLowerCase()] || categoryMap["vegetarian"];

    let url = "";
    if (selected.type === "meal") {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
        selected.value
      )}`;
    } else if (selected.type === "drink") {
      url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
        selected.value
      )}`;
    }

    console.log("Fetching from:", url); // ✅ Debug log

    const response = await fetch(url);
    const data = await response.json();

    if (!data.meals && !data.drinks) {
      return res.status(404).json({ message: "No items found" });
    }

    // Normalize meals/drinks to a single format
    const items = (data.meals || data.drinks).map((item) => ({
      id: item.idMeal || item.idDrink,
      name: item.strMeal || item.strDrink,
      image: item.strMealThumb || item.strDrinkThumb,
    }));

    res.json({ meals: items });
  } catch (err) {
    console.error("Meal/Drink API Error:", err.message);
    res.status(500).json({ message: "Failed to fetch meals/drinks" });
  }
};
