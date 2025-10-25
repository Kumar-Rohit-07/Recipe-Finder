import React from "react";
import { useNavigate } from "react-router-dom";

const DishResultCard = ({ dish }) => {
  const navigate = useNavigate();

  // Flatten _doc if needed
  const meal = dish._doc || dish;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md p-4 text-white hover:scale-[1.02] transition flex flex-col">
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="w-full h-48 object-cover rounded-lg mb-3"
      />
      <h3 className="text-lg font-semibold">{meal.strMeal}</h3>
      <p className="text-sm opacity-80 mb-2">{meal.strCategory}</p>

      <p className="text-sm mb-1">
        ⭐ Rating:{" "}
        <span className="font-bold">{meal.avgRating || "N/A"}</span>
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
        onClick={() => navigate(`/details/${meal.idMeal}`)}
        className="mt-auto bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition"
      >
        View Details
      </button>
    </div>
  );
};

export default DishResultCard;
