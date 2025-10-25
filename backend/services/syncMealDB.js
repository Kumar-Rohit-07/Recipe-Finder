// services/syncMealDB.js
import fetch from "node-fetch";
import Meal from "../models/dbModels.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* --------------------------------------------------
 🧠 AI-Based Classification (Gemini + Keyword Fallback)
-------------------------------------------------- */
const classifyMeal = async (meal) => {
  const ingredientsText = meal.ingredients.join(", ").toLowerCase();

  const prompt = `
You are an expert food classifier.
Classify the meal into ONE of these categories:
1️⃣ vegetarian
2️⃣ non-veg
3️⃣ desserts
4️⃣ drinks

Rules:
🍃 VEGETARIAN — no meat/fish; may include dairy or eggs.
🍗 NON-VEG — has meat, fish, or eggs as primary ingredients.
🍰 DESSERTS — sweet dishes like cakes, puddings, etc.
🥤 DRINKS — beverages such as coffee, juice, smoothies.

Given ingredients:
---
${ingredientsText}
---
Return ONLY one word: vegetarian, non-veg, desserts, or drinks.
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { temperature: 0.3 },
    });

    const result = await model.generateContent(prompt);
    const reply = result.response.text().toLowerCase().trim();

    if (reply.includes("vegetarian")) return "vegetarian";
    if (reply.includes("dessert")) return "desserts";
    if (reply.includes("drink")) return "drinks";
    if (reply.includes("non")) return "non-veg";

    // 🧩 Keyword fallback (AI unsure)
    if (/chicken|meat|beef|lamb|fish|pork|bacon|shrimp|egg/.test(ingredientsText)) return "non-veg";
    if (/sugar|cream|chocolate|ice|cake|cookie|sweet|pudding|custard/.test(ingredientsText)) return "desserts";
    if (/juice|coffee|tea|cocktail|smoothie|milkshake|drink|soda/.test(ingredientsText)) return "drinks";
    if (/tofu|paneer|vegetable|lentil|bean|spinach|rice|dal|potato|cheese|broccoli/.test(ingredientsText)) return "vegetarian";

    return "non-veg";
  } catch (err) {
    console.error("⚠️ AI classification error:", err.message);

    // 🔁 Fallback classification when Gemini fails
    if (/chicken|meat|beef|lamb|fish|pork|bacon|shrimp|egg/.test(ingredientsText)) return "non-veg";
    if (/sugar|cream|chocolate|ice|cake|cookie|sweet|pudding|custard/.test(ingredientsText)) return "desserts";
    if (/juice|coffee|tea|cocktail|smoothie|milkshake|drink|soda/.test(ingredientsText)) return "drinks";
    if (/tofu|paneer|vegetable|lentil|bean|spinach|rice|dal|potato|cheese|broccoli/.test(ingredientsText)) return "vegetarian";

    return "non-veg";
  }
};

/* --------------------------------------------------
 🍽 Extract Ingredients & Measures
-------------------------------------------------- */
const extractIngredients = (meal) => {
  const ingredients = [];
  const measures = [];

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]?.trim();
    const mea = meal[`strMeasure${i}`]?.trim();
    if (ing) ingredients.push(ing);
    if (mea) measures.push(mea);
  }

  return { ingredients, measures };
};

/* --------------------------------------------------
 🌐 Safe Fetch (Retry logic)
-------------------------------------------------- */
const safeFetch = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`⚠️ Fetch failed (${i + 1}/${retries}) for ${url}: ${err.message}`);
      if (i < retries - 1) {
        console.log("🔁 Retrying in 5s...");
        await new Promise((res) => setTimeout(res, 5000));
      } else {
        throw err;
      }
    }
  }
};

/* --------------------------------------------------
 🔄 Main Function: Sync TheMealDB → MongoDB (AI Mode)
-------------------------------------------------- */
export const syncMealDB = async () => {
  console.log("🔄 Starting TheMealDB → MongoDB Sync (AI Mode)...");

  try {
    const existingCount = await Meal.countDocuments();
    if (existingCount > 0) {
      console.log(`✅ Skipping sync — ${existingCount} meals already exist.`);
      return true;
    }

    // 🧩 Broader set of categories for diversity
    const categories = [
      "Beef", "Chicken", "Dessert", "Lamb", "Pasta", "Pork",
      "Seafood", "Vegetarian", "Miscellaneous", "Breakfast",
      "Goat", "Vegan", "Side", "Starter"
    ];

    for (const category of categories) {
      console.log(`📦 Fetching category: ${category}`);

      let data;
      try {
        data = await safeFetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      } catch (err) {
        console.error(`❌ Skipping category ${category} — fetch failed`);
        continue;
      }

      if (!data.meals) {
        console.warn(`⚠️ No meals found for category: ${category}`);
        continue;
      }

      for (const m of data.meals) {
        let success = false;
        let attempts = 0;

        while (!success && attempts < 3) {
          attempts++;
          try {
            const mealData = await safeFetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`
            );

            const meal = mealData.meals?.[0];
            if (!meal) throw new Error("Meal not found in API");

            const { ingredients, measures } = extractIngredients(meal);
            const aiCategory = await classifyMeal({ ingredients });

            await Meal.updateOne(
              { idMeal: meal.idMeal },
              {
                $set: {
                  idMeal: meal.idMeal,
                  strMeal: meal.strMeal,
                  strCategory: meal.strCategory,
                  strArea: meal.strArea,
                  strInstructions: meal.strInstructions,
                  strMealThumb: meal.strMealThumb,
                  strTags: meal.strTags,
                  strYoutube: meal.strYoutube,
                  ingredients,
                  measures,
                  aiCategory,
                },
              },
              { upsert: true }
            );

            console.log(`✅ Saved: ${meal.strMeal} → ${aiCategory}`);
            success = true;

            // ⏳ Small delay to avoid API rate limits
            await new Promise((res) => setTimeout(res, 2000));
          } catch (err) {
            console.error(`⚠️ Error on ${m.strMeal} (attempt ${attempts}/3): ${err.message}`);
            if (attempts < 3) {
              console.log("🔁 Retrying in 10 seconds...");
              await new Promise((res) => setTimeout(res, 10000));
            } else {
              console.error(`❌ Skipping ${m.strMeal} after 3 failed attempts.`);
            }
          }
        }
      }

      console.log(`✅ Finished syncing category: ${category}`);
    }

    console.log("🎉 All meals successfully synced to MongoDB (AI Classified)!");
    return true;
  } catch (err) {
    console.error("❌ Global sync error:", err.message);
    return false;
  }
};
