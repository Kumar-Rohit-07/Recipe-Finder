// utils/ingredientsLogic.js

// 🔹 Exclude meals containing allergens
export const filterByAllergies = (meals, allergies) => {
  if (!allergies || allergies.length === 0) return meals;
  const normalizedAllergies = allergies.map((a) => a.toLowerCase());
  return meals.filter(
    (meal) =>
      !meal.ingredients.some((ing) =>
        normalizedAllergies.includes(ing.toLowerCase())
      )
  );
};

// 🔹 Calculate how many ingredients match between user & meal
export const calculateMatchScore = (userIngredients, mealIngredients = []) => {
  const normalizedUserIngredients = userIngredients.map((i) => i.toLowerCase());
  const matched = mealIngredients.filter((i) =>
    normalizedUserIngredients.includes(i.toLowerCase())
  );
  return matched.length;
};

// 🔹 Rank meals based on how many ingredients match
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

// 🔹 Main logic to search meals based on ingredients + category + allergies
export const getMealsByIngredients = (meals, ingredients, aiCategory, allergies) => {
  if (!meals || meals.length === 0) return [];

  // Ensure ingredients is always an array
  if (!Array.isArray(ingredients)) {
    if (typeof ingredients === "string") {
      ingredients = ingredients.split(",").map((i) => i.trim());
    } else {
      ingredients = [];
    }
  }

  // Step 1: Filter by category if provided
  let filteredMeals = aiCategory
    ? meals.filter(
        (meal) =>
          meal.aiCategory &&
          meal.aiCategory.toLowerCase() === aiCategory.toLowerCase()
      )
    : meals;

  // Step 2: Filter by ingredients
  if (ingredients.length > 0) {
    const ingredientRegex = ingredients.map((i) => new RegExp(i, "i"));
    filteredMeals = filteredMeals.filter((meal) =>
      (meal.ingredients || []).some((ing) =>
        ingredientRegex.some((r) => r.test(ing))
      )
    );
  }

  // Step 3: Apply allergy filter
  filteredMeals = filterByAllergies(filteredMeals, allergies);

  // Step 4: Rank meals
  const ranked = rankMeals(filteredMeals, ingredients);

  // Return top 20 matches
  return ranked.slice(0, 20);
};

