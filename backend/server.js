import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

// 🧩 Import routes
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import timerRoutes from "./routes/timerRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import dbRoutes from "./routes/dbRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import countryRoutes from "./routes/countryRoutes.js";
import ingredientsRoutes from "./routes/ingredientRoutes.js";
import userRoutes from "./routes/userRoutes.js";   // ✅ Handles profile + profile-pic upload
import likeRoutes from "./routes/likeRoutes.js";

// 🧩 Community routes
import communityRecipeRoutes from "./routes/communityRecipeRoutes.js";
import communityCommentRoutes from "./routes/communityCommentRoutes.js";
import communityChatRoutes from "./routes/communityChatRoutes.js";

// 🧩 Chat controller helpers
import {
  saveMessage,
  deleteMessageById,
  updateMessageById,
} from "./controllers/communityChatController.js";

import { syncMealDB } from "./services/syncMealDB.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
app.use(express.json());

// ✅ CORS
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Static file serving
// Existing static folders
app.use(
  "/uploads/community-recipes",
  express.static(path.join(__dirname, "uploads/community-recipes"))
);
app.use(
  "/uploads/community-chat",
  express.static(path.join(__dirname, "uploads/community-chat"))
);

// ✅ 🆕 Add static serving for profile pictures (and general uploads)
app.use(
  "/uploads/profile_pics",
  express.static(path.join(__dirname, "uploads/profile_pics"))
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Socket.io setup
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

// 👥 Track active users
const activeUsers = new Set();

io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  // ✅ Register user as online
  socket.on("register-user", (userId) => {
    socket.userId = userId;
    if (userId) activeUsers.add(userId);
    console.log("✅ Registered user:", userId);
    io.emit("online-count", activeUsers.size);
  });

  // 💬 New message
  socket.on("send-message", async (data) => {
    try {
      const newMsg = await saveMessage(data);
      io.emit("receive-message", newMsg);
    } catch (error) {
      console.error("❌ Error saving message:", error.message);
    }
  });

  // 🗑️ Delete message
  socket.on("delete-message", async (messageId) => {
    try {
      const deleted = await deleteMessageById(messageId);
      if (deleted) {
        io.emit("message-deleted", messageId); // notify everyone
        console.log(`🗑️ Message deleted: ${messageId}`);
      }
    } catch (error) {
      console.error("❌ Error deleting message:", error.message);
    }
  });

  // ✏️ Edit message
  socket.on("edit-message", async ({ id, newText }) => {
    try {
      const updated = await updateMessageById({ id, newText });
      if (updated) {
        io.emit("message-edited", updated); // broadcast updated msg
        console.log(`✏️ Message edited: ${id}`);
      }
    } catch (error) {
      console.error("❌ Error editing message:", error.message);
    }
  });

  // 🔴 Handle disconnect
  socket.on("disconnect", () => {
    if (socket.userId) activeUsers.delete(socket.userId);
    console.log("🔴 User Disconnected:", socket.userId || socket.id);
    io.emit("online-count", activeUsers.size);
  });
});

// Attach io instance
app.set("io", io);

// ✅ API routes
app.use("/api/community/recipes", communityRecipeRoutes);
app.use("/api/community/comments", communityCommentRoutes);
app.use("/api/community/chat", communityChatRoutes);

// ✅ Other routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/timer", timerRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/db", dbRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/ingredients", ingredientsRoutes);
app.use("/api/user", userRoutes);   // ✅ profile routes (includes profile-pic)
app.use("/api/likes", likeRoutes);

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "recipe_finder" });
    console.log("✅ Connected to MongoDB");

    // Optional: Sync meals if DB is empty
    const Meal = (await import("./models/dbModels.js")).default;
    const count = await Meal.countDocuments();
    if (count === 0) {
      console.log("📦 Syncing meal database...");
      await syncMealDB();
      console.log("✅ Database sync complete");
    }

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

connectDB();
