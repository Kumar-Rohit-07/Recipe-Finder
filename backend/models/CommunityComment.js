// models/CommunityComment.js
import mongoose from "mongoose";

// models/CommunityComment.js
const communityCommentSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommunityRecipe",
    required: false,          // ✅ was true before
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommunityComment",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CommunityComment", communityCommentSchema);
