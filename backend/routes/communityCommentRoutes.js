import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addComment, getComments, addReply } from "../controllers/communityCommentController.js";

const router = express.Router();

// Create a main comment
router.post("/:recipeId", protect, addComment);

// Create a reply to a comment
router.post("/reply/:commentId", protect, addReply);

// Get all comments (with replies joined)
router.get("/:recipeId", getComments);

export default router;
