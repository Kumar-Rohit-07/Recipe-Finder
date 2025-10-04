// src/pages/details.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ⬅️ import navigate
import axios from "axios";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ⬅️ setup navigation

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/meals/meal/${id}`);
        setDish(res.data);
      } catch (err) {
        setError("Failed to load dish details");
      } finally {
        setLoading(false);
      }
    };
    fetchDish();
  }, [id]);

  if (loading) return <div className="text-white text-2xl text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-2xl text-center">{error}</div>;
  if (!dish) return null;

  // ✅ Normalized category (backend already fixes this, but fallback included)
  const category = dish.category?.trim() || "Uncategorized";

  // 🎨 Styling per category
  const categoryStyles = {
    Veg: {
      bg: "bg-gradient-to-b from-green-200 via-green-100 to-white",
      badge: "bg-green-600/90 text-white shadow-lg shadow-green-400/50",
      glow: "shadow-green-400/60",
      circle: "bg-green-600",
    },
    "Non-Veg": {
      bg: "bg-gradient-to-b from-red-200 via-red-100 to-white",
      badge: "bg-red-700/90 text-white shadow-lg shadow-red-400/50",
      glow: "shadow-red-400/60",
      circle: "bg-red-600",
    },
    Dessert: {
      bg: "bg-gradient-to-b from-blue-200 via-blue-100 to-white",
      badge: "bg-blue-700/90 text-white shadow-lg shadow-blue-400/50",
      glow: "shadow-blue-400/60",
      circle: "bg-blue-600",
    },
    Drink: {
      bg: "bg-gradient-to-b from-yellow-200 via-yellow-100 to-white",
      badge: "bg-yellow-600/90 text-white shadow-lg shadow-yellow-400/50",
      glow: "shadow-yellow-400/60",
      circle: "bg-yellow-500",
    },
    Uncategorized: {
      bg: "bg-gradient-to-b from-slate-200 via-slate-100 to-white",
      badge: "bg-gray-700/90 text-white shadow-lg shadow-gray-400/50",
      glow: "shadow-gray-400/60",
      circle: "bg-gray-500",
    },
  };

  const { bg, badge, glow, circle } = categoryStyles[category] || categoryStyles.Uncategorized;

  return (
    <div className={`min-h-screen w-full ${bg} p-6 flex flex-col items-center text-gray-900`}>
      <div className="w-full max-w-6xl flex flex-col gap-8">
        
        {/* 🔹 Top Row: Image + Name + Category Badge */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Image */}
          <img
            src={dish.image}
            alt={dish.name}
            className={`w-full md:w-1/3 h-[250px] object-cover rounded-lg shadow-2xl ${glow}`}
          />

          {/* Name + Category */}
          <div className="flex flex-col justify-center md:justify-start text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2 drop-shadow-md">{dish.name}</h1>

            {/* ✅ Category Badge with Circle */}
            <div className="flex items-center justify-center md:justify-start mb-4 gap-2">
              {/* Circle */}
              <span className={`w-3 h-3 rounded-full ${circle}`}></span>

              {/* Text Badge */}
              <span className={`px-4 py-1 rounded-full text-sm font-semibold shadow-lg ${badge}`}>
                {category}
              </span>
            </div>

            {/* 🔹 Guide Button → navigates to Guide Page */}
            <button
              onClick={() => navigate(`/guide/${id}`)} // ⬅️ Navigate
              className="px-6 py-2 rounded-full text-white font-semibold shadow-lg 
                bg-gradient-to-r from-yellow-400 to-orange-500
                hover:scale-105 transition-transform duration-300"
            >
              Guide
            </button>
          </div>
        </div>

        {/* 🔹 Middle Row: Ingredients | Procedure */}
        <div
          className={`flex flex-col md:flex-row md:divide-x-2 md:divide-gray-400 
                     backdrop-blur-md bg-white/70 rounded-2xl shadow-2xl ${glow} p-6`}
        >
          {/* Ingredients */}
          <div className="w-full md:w-1/2 md:pr-6">
            <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
            <ul className="list-disc pl-6 space-y-1">
              {dish.ingredients?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Procedure */}
          <div className="w-full md:w-1/2 md:pl-6 mt-6 md:mt-0">
            <h2 className="text-2xl font-semibold mb-3">Cooking Procedure</h2>
            <p className="leading-relaxed whitespace-pre-line">{dish.procedure}</p>
          </div>
        </div>

        {/* 🔹 Optional Bottom Section (extra image / content) */}
        {dish.extraImage && (
          <div className="w-full">
            <img
              src={dish.extraImage}
              alt="Extra"
              className={`w-full h-[250px] object-cover rounded-lg shadow-2xl ${glow}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
