// utils/ingredientsLogic.js

// ✅ Normalize category from UI to match database values
const normalizeCategory = (cat) => {
  if (!cat) return null;
  cat = cat.toLowerCase();

  if (["vegetarian", "veg"].includes(cat)) return "vegetarian";
  if (["non-veg", "nonveg", "non vegetarian", "meat"].includes(cat)) return "non-veg";
  if (["dessert", "desserts", "sweet"].includes(cat)) return "dessert";
  if (["drinks", "drink", "beverage"].includes(cat)) return "drinks";

  return null; // means no category filter
};

// ✅ Exclude meals containing allergen ingredients (partial-match supported)
export const filterByAllergies = (meals, allergies) => {
  if (!allergies || allergies.length === 0) return meals;

  const normalizedAllergies = allergies.map((a) => a.toLowerCase());

  return meals.filter(
    (meal) =>
      !(meal.ingredients || []).some((ing) =>
        normalizedAllergies.some((a) => ing.toLowerCase().includes(a))
      )
  );
};

// ✅ Calculate how many ingredients match
export const calculateMatchScore = (userIngredients, mealIngredients = []) => {
  const normalizedUserIngredients = userIngredients.map((i) => i.toLowerCase());
  const matched = mealIngredients.filter((i) =>
    normalizedUserIngredients.includes(i.toLowerCase())
  );
  return matched.length;
};

// ✅ Rank meals by best ingredient match
export const rankMeals = (meals, userIngredients) => {
  const normalizedUserIngredients = userIngredients.map((i) => i.toLowerCase());

  return meals
    .map((meal) => {
      const mealIngredients = meal.ingredients || [];
      const matchScore = calculateMatchScore(userIngredients, mealIngredients);
      const missingIngredients = mealIngredients.filter(
        (i) => !normalizedUserIngredients.includes(i.toLowerCase())
      );

      return {
        ...meal,
        matchScore,
        missingIngredients,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};

// ✅ MAIN LOGIC — Ingredients + Category + Allergy + Ranking
export const getMealsByIngredients = (meals, ingredients, aiCategory, allergies) => {
  if (!meals || meals.length === 0) return [];

  // Normalize category to DB-compatible value
  const normalizedCategory = normalizeCategory(aiCategory);

  // Ensure ingredients is always an array
  if (!Array.isArray(ingredients)) {
    ingredients = (ingredients || "").split(",").map((i) => i.trim().toLowerCase());
  } else {
    ingredients = ingredients.map((i) => i.toLowerCase());
  }

  // 1️⃣ Filter by category **only if selected**
  let filteredMeals = normalizedCategory
    ? meals.filter(
        (meal) =>
          meal.aiCategory?.toLowerCase() === normalizedCategory
      )
    : meals;

  // 2️⃣ Filter meals that contain at least one requested ingredient
  if (ingredients.length > 0) {
    const ingredientRegex = ingredients.map((i) => new RegExp(i, "i"));
    filteredMeals = filteredMeals.filter((meal) =>
      (meal.ingredients || []).some((ing) =>
        ingredientRegex.some((r) => r.test(ing))
      )
    );
  }

  // 3️⃣ Remove meals containing allergens (fixed partial match)
  filteredMeals = filterByAllergies(filteredMeals, allergies);

  // 4️⃣ Rank meals based on number of matched ingredients
  const ranked = rankMeals(filteredMeals, ingredients);

  // Return the top 20 best matches
  return ranked.slice(0, 20);
};
