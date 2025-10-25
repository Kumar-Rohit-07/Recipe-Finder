import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import timerRoutes from "./routes/timerRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import dbRoutes from "./routes/dbRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import countryRoutes from "./routes/countryRoutes.js";
import ingredientsRoutes from "./routes/ingredientRoutes.js"; // ✅ updated

import { syncMealDB } from "./services/syncMealDB.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/timer", timerRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/db", dbRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/ingredients", ingredientsRoutes); // ✅ new

// MongoDB connection & server start
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "recipe_finder",
    });
    console.log("✅ Connected to MongoDB");

    const Meal = (await import("./models/dbModels.js")).default;
    const count = await Meal.countDocuments();

    if (count === 0) {
      console.log("📦 No meals found — syncing from TheMealDB...");
      await syncMealDB();
      console.log("✅ Database sync complete");
    } else {
      console.log(`🍴 Meals already present (${count} records) — skipping sync`);
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

connectDB();
