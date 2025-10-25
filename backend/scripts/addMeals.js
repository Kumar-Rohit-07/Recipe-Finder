// backend/scripts/addMeals.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Meal from "../models/dbModels.js";

dotenv.config();

const DB_NAME = "recipe_finder";

// 📁 JS file imports
import vegetarianData from "../data/vegetarian_data.js";
import nonvegData from "../data/non-veg_data.js";
import dessertsData from "../data/desserts_data.js";
import drinksData from "../data/drinks_data.js";

const dataFiles = [
  { data: vegetarianData, category: "vegetarian" },
  { data: nonvegData, category: "non-veg" },
  { data: dessertsData, category: "desserts" },
  { data: drinksData, category: "drinks" },
];

const importData = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, { dbName: DB_NAME });
    console.log("✅ Connected to MongoDB\n");

    let totalInserted = 0;
    let totalUpdated = 0;

    for (const { data, category } of dataFiles) {
      if (!Array.isArray(data)) {
        console.error(`❌ ${category} data is not an array! Skipping...`);
        continue;
      }

      console.log(`📂 Processing ${category.toUpperCase()} data...`);
      let inserted = 0;
      let updated = 0;

      for (const meal of data) {
        if (!meal.idMeal) {
          console.warn(`⚠️ Skipping invalid meal with missing idMeal in ${category}`);
          continue;
        }

        const mealData = { ...meal };
        delete mealData._id;
        mealData.aiCategory = category;

        if (category === "drinks") {
          // Force insert/update only for drinks
          const res = await Meal.updateOne(
            { idMeal: mealData.idMeal },
            { $set: mealData },
            { upsert: true }
          );

          if (res.upsertedCount) inserted++;
          else updated++;
        } else {
          // For other categories, insert only if not exists
          const exists = await Meal.exists({ idMeal: mealData.idMeal });
          if (exists) continue;
          await Meal.create(mealData);
          inserted++;
        }
      }

      console.log(
        `✅ Done ${category}: Inserted ${inserted}${category === "drinks" ? `, Updated ${updated}` : ""}`
      );
      totalInserted += inserted;
      totalUpdated += updated;
    }

    console.log("\n🎉 Import completed!");
    console.log(`📊 Summary → Inserted: ${totalInserted}, Updated (drinks only): ${totalUpdated}`);
  } catch (err) {
    console.error("❌ Error importing data:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
};

importData();
