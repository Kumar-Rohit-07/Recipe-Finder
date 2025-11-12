import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ✅ Store recipe IDs user liked
    likedRecipes: {
      type: [String],
      default: [],
    },

    // ✅ New field: store relative image path for profile picture
    profilePic: {
      type: String,
      default: "", // remains empty until user uploads one
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
