// scripts/fixOldMeals.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Meal from "../models/dbModels.js"; // adjust if your model file path differs

dotenv.config();

const updateOldMeals = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, { dbName: "recipe_finder" });

    const result = await Meal.updateMany(
      { avgRating: { $exists: false } },
      { $set: { avgRating: 3, totalRatings: 1 } }
    );

    console.log(`✅ Updated ${result.modifiedCount} old meals`);
  } catch (error) {
    console.error("❌ Error updating old meals:", error);
  } finally {
    mongoose.connection.close();
  }
};

updateOldMeals();
