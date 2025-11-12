import React from "react";
import { useNavigate } from "react-router-dom";

const DishCard = ({ dish }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow backdrop-blur-md bg-white/30 m-10 shadow-2xl overflow-auto hide-scrollbar p-2">
      <img
        src={dish.strMealThumb}
        alt={dish.strMeal}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-xl font-bold mb-2 text-gray-900">{dish.strMeal}</h2>
        <p className="text-gray-600 mb-2">Category: {dish.aiCategory}</p>
        <p className="text-yellow-500 font-semibold mb-3">⭐ {dish.avgRating}</p>

        {/* ✅ FIXED */}
        <button
          onClick={() => navigate(`/meal/${dish._id}`)}
          className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default DishCard;
