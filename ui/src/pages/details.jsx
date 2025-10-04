import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Details = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ State for Read More toggles
  const [showFullIngredients, setShowFullIngredients] = useState(false);
  const [showFullProcedure, setShowFullProcedure] = useState(false);

  // ✅ Refs for scrollIntoView
  const ingredientsRef = useRef(null);
  const procedureRef = useRef(null);

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

  // ✅ Normalized category
  const category = dish.category?.trim() || "Uncategorized";

  // 🎨 Styling per category (Diagonal Radial Gradient)
  const categoryStyles = {
    Veg: {
      bg: "bg-[radial-gradient(circle_at_top_left,#bbf7d0,#065f46)] bg-[length:200%_200%] animate-gradient-move",
      badge: "bg-green-600/90 text-white shadow-lg shadow-green-400/50",
      circle: "bg-green-600",
    },
    "Non-Veg": {
      bg: "bg-[radial-gradient(circle_at_top_left,#fecaca,#7f1d1d)] bg-[length:200%_200%] animate-gradient-move",
      badge: "bg-red-700/90 text-white shadow-lg shadow-red-400/50",
      circle: "bg-red-600",
    },
    Dessert: {
      bg: "bg-[radial-gradient(circle_at_top_left,#e0e7ff,#1e3a8a)] bg-[length:200%_200%] animate-gradient-move",
      badge: "bg-blue-700/90 text-white shadow-lg shadow-blue-400/50",
      circle: "bg-blue-600",
    },
    Drink: {
      bg: "bg-[radial-gradient(circle_at_top_left,#fef08a,#92400e)] bg-[length:200%_200%] animate-gradient-move",
      badge: "bg-yellow-600/90 text-white shadow-lg shadow-yellow-400/50",
      circle: "bg-yellow-500",
    },
    Uncategorized: {
      bg: "bg-[radial-gradient(circle_at_top_left,#f3f4f6,#1f2937)] bg-[length:200%_200%] animate-gradient-move",
      badge: "bg-gray-700/90 text-white shadow-lg shadow-gray-400/50",
      circle: "bg-gray-500",
    },
  };

  const { bg, badge, circle } = categoryStyles[category] || categoryStyles.Uncategorized;

  return (
    <div className={`min-h-screen w-full ${bg} p-6 flex flex-col items-center text-gray-900`}>
      <div className="w-full max-w-6xl flex flex-col gap-8">
        
        {/* 🔹 Top Row: Image + Name + Category Badge */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Image (✅ removed shadow + glow) */}
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full md:w-1/3 h-[250px] object-cover rounded-lg"
          />

          {/* Name + Category */}
          <div className="flex flex-col justify-center md:justify-start text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2 drop-shadow-md">{dish.name}</h1>

            {/* ✅ Category Badge with Circle */}
            <div className="flex items-center justify-center md:justify-start mb-4 gap-2">
              <span className={`w-3 h-3 rounded-full ${circle}`}></span>
              <span className={`px-4 py-1 rounded-full text-sm font-semibold shadow-lg ${badge}`}>
                {category}
              </span>
            </div>

            {/* 🔹 Guide Button */}
            <button
              className="px-2 py-2 rounded-full text-sm text-white font-medium shadow-md 
                        bg-gradient-to-r from-yellow-400 to-orange-500
                        hover:scale-105 transition-transform duration-300"

            >
              Guide
            </button>
          </div>
        </div>

        {/* 🔹 Middle Row: Ingredients | Procedure */}
        <div
          className="flex flex-col md:flex-row md:divide-x-2 md:divide-gray-400 
                     backdrop-blur-md bg-white/70 rounded-2xl p-6"
        >
          {/* Ingredients */}
          <div className="w-full md:w-1/2 md:pr-6" ref={ingredientsRef}>
            <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
            <ul
              className={`list-disc pl-6 space-y-1 transition-all duration-500 ${
                showFullIngredients ? "max-h-full" : "max-h-40 overflow-hidden"
              }`}
            >
              {dish.ingredients?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            {dish.ingredients?.length > 8 && (
              <button
                onClick={() => {
                  setShowFullIngredients(!showFullIngredients);
                  setTimeout(() => {
                    ingredientsRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 200);
                }}
                className="mt-3 text-blue-600 hover:underline font-medium"
              >
                {showFullIngredients ? "Read Less" : "Read More"}
              </button>
            )}
          </div>

          {/* Procedure */}
          <div className="w-full md:w-1/2 md:pl-6 mt-6 md:mt-0" ref={procedureRef}>
            <h2 className="text-2xl font-semibold mb-3">Cooking Procedure</h2>
            <p
              className={`leading-relaxed whitespace-pre-line transition-all duration-500 ${
                showFullProcedure ? "max-h-full" : "max-h-40 overflow-hidden"
              }`}
            >
              {dish.procedure}
            </p>
            {dish.procedure?.length > 300 && (
              <button
                onClick={() => {
                  setShowFullProcedure(!showFullProcedure);
                  setTimeout(() => {
                    procedureRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 200);
                }}
                className="mt-3 text-blue-600 hover:underline font-medium"
              >
                {showFullProcedure ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        </div>

        {/* 🔹 Optional Bottom Section */}
        {dish.extraImage && (
          <div className="w-full">
            <img
              src={dish.extraImage}
              alt="Extra"
              className="w-full h-[250px] object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
