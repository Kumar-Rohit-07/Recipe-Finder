import fetch from "node-fetch";

// ✅ Existing: Get meals/drinks by category
export const getMealsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Map categories to correct API sources
    const categoryMap = {
      vegetarian: { type: "meal", value: "Vegetarian" },
      "non-veg": { type: "meal", value: "Chicken" },
      desserts: { type: "meal", value: "Dessert" },
      drinks: { type: "drink", value: "Cocktail" }, // ✅ Cocktail is reliable
    };

    const selected =
      categoryMap[category.toLowerCase()] || categoryMap["vegetarian"];

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

    console.log("Fetching from:", url);

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

// ✅ New: Get meal/drink details by ID
export const getMealById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try MealDB first
    let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    let response = await fetch(url);
    let data = await response.json();

    let item = data.meals ? data.meals[0] : null;

    // If not found in MealDB, try CocktailDB
    if (!item) {
      url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
      response = await fetch(url);
      data = await response.json();
      item = data.drinks ? data.drinks[0] : null;
    }

    if (!item) {
      return res.status(404).json({ message: "Meal/Drink not found" });
    }

    // Extract ingredients (up to 20 fields in API)
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = item[`strIngredient${i}`];
      const measure = item[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${ingredient} - ${measure || ""}`);
      }
    }

    // Normalize structure
    const dish = {
      id: item.idMeal || item.idDrink,
      name: item.strMeal || item.strDrink,
      image: item.strMealThumb || item.strDrinkThumb,
      procedure: item.strInstructions,
      ingredients,
    };

    res.json(dish);
  } catch (err) {
    console.error("Meal Detail API Error:", err.message);
    res.status(500).json({ message: "Failed to fetch meal details" });
  }
};
