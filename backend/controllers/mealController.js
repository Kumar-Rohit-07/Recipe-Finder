import fetch from "node-fetch";

// ✅ Get meals/drinks by category
export const getMealsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const categoryMap = {
      vegetarian: { type: "meal", value: "Vegetarian" },
      "non-veg": { type: "meal", value: "Chicken" },
      desserts: { type: "meal", value: "Dessert" },
      drinks: { type: "drink", value: "Cocktail" },
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

    const response = await fetch(url);
    const data = await response.json();

    if (!data.meals && !data.drinks) {
      return res.status(404).json({ message: "No items found" });
    }

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

// ✅ Get meal/drink details by ID
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

    // Extract ingredients
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = item[`strIngredient${i}`];
      const measure = item[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${ingredient} - ${measure || ""}`);
      }
    }

    // Map category names
    const categoryMap = {
      Vegetarian: "Veg",
      Chicken: "Non-Veg",
      Dessert: "Dessert",
      Cocktail: "Drink",
    };

    const rawCategory = item.strCategory || item.strAlcoholic || "Uncategorized";
    const normalizedCategory = categoryMap[rawCategory] || "Uncategorized";

    // ✅ Smart step/paragraph logic
    let procedureSteps = [];
    let procedureParagraphs = [];

    if (item.strInstructions) {
      const cleanText = item.strInstructions
        .replace(/\r\n/g, "\n")
        .replace(/\n{2,}/g, "\n\n")
        .trim();

      // 🧩 1️⃣ If numbered steps (1., 2., etc.)
      if (/\d+\./.test(cleanText)) {
        const parts = cleanText
          .split(/\d+\.\s*/)
          .map((p) => p.trim())
          .filter((p) => p.length > 3);
        procedureParagraphs = parts;
        procedureSteps = parts.map((p, i) => `Step ${i + 1}: ${p}`);
      }
      // 🧩 2️⃣ If "Step 1", "Step 2", etc.
      else if (/Step\s*\d+/i.test(cleanText)) {
        const parts = cleanText
          .split(/Step\s*\d+[:.\-]?\s*/i)
          .map((p) => p.trim())
          .filter((p) => p.length > 3);
        procedureParagraphs = parts;
        procedureSteps = parts.map((p, i) => `Step ${i + 1}: ${p}`);
      }
      // 🧩 3️⃣ If blank lines (paragraph gaps)
      else if (/\n{2,}/.test(cleanText)) {
        const parts = cleanText
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter((p) => p.length > 3);
        procedureParagraphs = parts;
        procedureSteps = parts.map((p, i) => `Step ${i + 1}: ${p}`);
      }
      // 🧩 4️⃣ Else – group every 3 sentences
      else {
        const sentences = cleanText
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 3);
        for (let i = 0; i < sentences.length; i += 3) {
          const chunk = sentences.slice(i, i + 3).join(" ");
          procedureParagraphs.push(chunk);
          procedureSteps.push(`Step ${procedureSteps.length + 1}: ${chunk}`);
        }
      }
    }

    const dish = {
      id: item.idMeal || item.idDrink,
      name: item.strMeal || item.strDrink,
      image: item.strMealThumb || item.strDrinkThumb,
      procedure: item.strInstructions,
      procedureParagraphs,
      procedureSteps,
      ingredients,
      category: normalizedCategory,
    };

    res.json(dish);
  } catch (err) {
    console.error("Meal Detail API Error:", err.message);
    res.status(500).json({ message: "Failed to fetch meal details" });
  }
};
