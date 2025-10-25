import Rating from "../models/Rating.js";
import Meal from "../models/dbModels.js"; // 🧩 Added to map external mealId → Mongo _id

// ✅ Add or update a rating for a dish
export const addOrUpdateRating = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    const { mealId, rating } = req.body;

    if (!mealId || !rating) {
      return res.status(400).json({ message: "Meal ID and rating are required" });
    }

    // 🔍 Convert external idMeal → internal Mongo _id
    const meal = await Meal.findOne({ idMeal: mealId });
    if (!meal) {
      return res.status(404).json({ message: "Meal not found in database" });
    }

    // 🔁 Check if user already rated this meal
    let existing = await Rating.findOne({ mealId: meal._id, userId });

    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({ message: "Rating updated successfully", rating: existing });
    }

    // 🆕 Create a new rating
    const newRating = await Rating.create({
      mealId: meal._id,
      userId,
      rating,
    });

    res.status(201).json({ message: "Rating added successfully", rating: newRating });
  } catch (err) {
    console.error("❌ Add/Update Rating Error:", err.message);
    res.status(500).json({ message: "Failed to add/update rating", error: err.message });
  }
};

// ✅ Get average rating for a dish
export const getAverageRating = async (req, res) => {
  try {
    const { mealId } = req.params;

    // 🧠 Convert external idMeal → internal Mongo _id
    const meal = await Meal.findOne({ idMeal: mealId });
    if (!meal) return res.status(404).json({ message: "Meal not found" });

    const ratings = await Rating.find({ mealId: meal._id });

    // 🟡 If no ratings exist → return default 3 stars
    if (ratings.length === 0) {
      return res.json({ average: 3.0, totalRatings: 0 });
    }

    const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    res.json({
      average: parseFloat(average.toFixed(1)),
      totalRatings: ratings.length,
    });
  } catch (err) {
    console.error("Get Average Rating Error:", err.message);
    res.status(500).json({ message: "Failed to fetch average rating" });
  }
};

// ✅ Get top 5 dishes (highest rated)
export const getTopRatedDishes = async (req, res) => {
  try {
    const topRated = await Rating.aggregate([
      {
        $group: {
          _id: "$mealId",
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
      { $sort: { avgRating: -1, totalRatings: -1 } },
      { $limit: 5 },
    ]);

    res.json(topRated);
  } catch (err) {
    console.error("Top Rated Dishes Error:", err.message);
    res.status(500).json({ message: "Failed to fetch top rated dishes" });
  }
};

// ✅ Check if a user has rated a specific dish
export const checkIfUserRated = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mealId } = req.params;

    // 🧠 Convert external idMeal → internal Mongo _id
    const meal = await Meal.findOne({ idMeal: mealId });
    if (!meal) return res.status(404).json({ message: "Meal not found" });

    const existing = await Rating.findOne({ userId, mealId: meal._id });
    res.json({ rated: !!existing });
  } catch (err) {
    console.error("Check User Rating Error:", err.message);
    res.status(500).json({ message: "Failed to check if user rated" });
  }
};
