import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// ✅ Import route files
import authRoutes from "./routes/authRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import timerRoutes from "./routes/timerRoutes.js"; // 🔥 NEW: Timer route for AI-based cooking timer

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/timer", timerRoutes); // 🔥 Added: Timer route endpoint

// ✅ Verify Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ Gemini API key not found! Please set GEMINI_API_KEY in .env");
} else {
  console.log("✅ Gemini API key loaded successfully");
}

// ✅ MongoDB Connection + Server Start
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

// ✅ Initialize DB
connectDB();
