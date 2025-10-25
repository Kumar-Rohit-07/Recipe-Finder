import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  idMeal: String,
  strMeal: String,
  strCategory: String,
  strArea: String,
  strInstructions: String,
  strMealThumb: String,
  strTags: String,
  strYoutube: String,
  ingredients: [String],
  measures: [String],
  aiCategory: {
    type: String,
    enum: ["vegetarian", "non-veg", "desserts", "drinks"],
    default: "non-veg",
  },

  // ⭐️ New Rating Fields
  avgRating: {
    type: Number,
    default: 3, // Default for newly added meals
  },
  totalRatings: {
    type: Number,
    default: 1,
  },
});

const Meal = mongoose.model("Meal", mealSchema);
export default Meal;
