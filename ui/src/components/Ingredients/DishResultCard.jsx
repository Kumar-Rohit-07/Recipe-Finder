import React from "react";
import { useNavigate } from "react-router-dom";

const DishResultCard = ({ dish, isRecommended }) => {
  const navigate = useNavigate();
  const meal = dish._doc || dish;

  return (
    <div className="relative bg-white/10 backdrop-blur-lg rounded-xl shadow-md p-4 text-white hover:scale-[1.02] transition flex flex-col">

      {/* ⭐ Recommended badge */}
      {isRecommended && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-md">
          ⭐ Recommended
        </span>
      )}

      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="w-full h-48 object-cover rounded-lg mb-3"
      />

      <h3 className="text-lg font-semibold">{meal.strMeal}</h3>
      <p className="text-sm opacity-80 mb-2 capitalize">{meal.aiCategory}</p>

      <p className="text-sm mb-1">
        ⭐ Rating: <span className="font-bold">{meal.avgRating?.toFixed(1) || "N/A"}</span>
      </p>

      <p className="text-sm mb-2">
        ✅ Match Score: <span className="font-bold">{meal.matchScore}</span>
      </p>

      {meal.missingIngredients?.length > 0 && (
        <p className="text-sm text-red-300 mt-1">
          Missing: {meal.missingIngredients.slice(0, 4).join(", ")}...
        </p>
      )}

      <button
        onClick={() => navigate(`/meal/${meal._id || meal.idMeal}`)}
        className="mt-auto bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition"
      >
        View Details
      </button>
    </div>
  );
};

export default DishResultCard;
