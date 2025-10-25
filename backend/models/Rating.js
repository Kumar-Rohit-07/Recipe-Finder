import mongoose from "mongoose";
import Meal from "./dbModels.js";

// 🧾 Define Rating Schema
const ratingSchema = new mongoose.Schema(
  {
    mealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

// ✅ Ensure each user can rate one meal only once
ratingSchema.index({ mealId: 1, userId: 1 }, { unique: true });

// 🔄 Automatically update Meal avgRating after each save
ratingSchema.post("save", async function () {
  const mealRatings = await mongoose.model("Rating").find({ mealId: this.mealId });
  const avg =
    mealRatings.reduce((acc, r) => acc + r.rating, 0) / mealRatings.length;

  await Meal.findByIdAndUpdate(this.mealId, {
    avgRating: avg,
    totalRatings: mealRatings.length,
  });
});

// ✅ Create and export the Rating model
const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;
