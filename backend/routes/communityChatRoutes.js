import express from "express";
import multer from "multer";
import path from "path";
import {
  getMessages,
  uploadImage,
  deleteMessage,
  editMessage,
} from "../controllers/communityChatController.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ correct import

const router = express.Router();

// 🗂️ Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/community-chat"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// 🟢 Get all messages
router.get("/", getMessages);

// 🟢 Upload image (returns URL)
router.post("/upload", upload.single("image"), uploadImage);

// 🗑️ Delete a message (only by owner)
router.delete("/:id", protect, deleteMessage);

// ✏️ Edit a text message (only by owner)
router.put("/:id", protect, editMessage);

export default router;
