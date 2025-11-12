// models/CommunityRecipe.js
import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  ingredient: { type: String, required: true },
  measure: { type: String, required: true }
});

const communityRecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  country: { type: String, required: true },
  ingredients: [ingredientSchema],
  steps: [{ type: String, required: true }],
  image: { type: String, required: true },
  videoLink: { type: String, default: "" },
  
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CommunityRecipe", communityRecipeSchema);
