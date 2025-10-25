import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Details = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const rawId = params.id;
  const fallbackId = location.pathname.split("/").filter(Boolean).pop();
  const id = rawId || fallbackId || undefined;

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullIngredients, setShowFullIngredients] = useState(false);
  const [showFullProcedure, setShowFullProcedure] = useState(false);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const ingredientsRef = useRef(null);
  const procedureRef = useRef(null);

  useEffect(() => {
    const fetchDish = async () => {
      if (!id) {
        setError("Dish ID missing in URL");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`http://localhost:5000/api/meals/${id}`, { headers });
        setDish(res.data);
      } catch (err) {
        console.error("Failed to load dish details:", err.response?.data || err.message);
        setError("Failed to load dish details");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    setError(null);
    setDish(null);
    fetchDish();
  }, [id]);

  const handleRatingSubmit = async (value) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ You must be logged in to rate.");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/ratings",
        { mealId: id, rating: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRating(value);
      setHasRated(true);
      setShowRating(false);
      alert("⭐ Thanks for rating!");
    } catch (err) {
      console.error("Rating submit error:", err.response?.data || err.message);
      alert("❌ Failed to submit rating. Try again later.");
    }
  };

  if (loading) return <div className="text-white text-2xl text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-2xl text-center">{error}</div>;
  if (!dish) return null;

  // 🥗 Detect the category in a flexible way (handles variations)
  const categoryRaw = dish.category?.trim().toLowerCase();
  let categoryKey = "other";

  if (["veg", "vegetarian"].includes(categoryRaw)) categoryKey = "veg";
  else if (["non-veg", "nonveg", "non vegetarian", "chicken", "meat"].includes(categoryRaw))
    categoryKey = "nonveg";
  else if (["desserts", "sweet"].includes(categoryRaw)) categoryKey = "dessert";
  else if (["drinks", "beverage", "juice", "mocktail"].includes(categoryRaw)) categoryKey = "drink";

  // 🌈 Category-based colors
  const categoryStyles = {
    veg: {
      bg: "bg-gradient-to-br from-green-100 via-green-300 to-green-600",
      badge: "bg-green-700 text-white",
      circle: "bg-green-600",
      button: "bg-green-600 hover:bg-green-700 text-white",
    },
    nonveg: {
      bg: "bg-gradient-to-br from-red-100 via-red-400 to-red-700",
      badge: "bg-red-700 text-white",
      circle: "bg-red-600",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
    dessert: {
      bg: "bg-gradient-to-br from-pink-100 via-pink-400 to-pink-700",
      badge: "bg-pink-700 text-white",
      circle: "bg-pink-600",
      button: "bg-pink-600 hover:bg-pink-700 text-white",
    },
    drink: {
      bg: "bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500",
      badge: "bg-yellow-500 text-black",
      circle: "bg-yellow-400",
      button: "bg-yellow-500 hover:bg-yellow-600 text-black",
    },
    other: {
      bg: "bg-gradient-to-br from-gray-100 via-gray-400 to-gray-700",
      badge: "bg-gray-700 text-white",
      circle: "bg-gray-500",
      button: "bg-gray-500 hover:bg-gray-600 text-white",
    },
  };

  const { bg, badge, circle, button } = categoryStyles[categoryKey];

  return (
    <div className={`min-h-screen w-full ${bg} p-6 flex flex-col items-center transition-all duration-500`}>
      <div className="w-full max-w-6xl flex flex-col gap-8 relative text-gray-900">
        {/* ⭐ Rating Button */}
        <div className="fixed top-5 right-5 z-50">
          <button
            onClick={() => setShowRating((s) => !s)}
            className={`px-5 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 ${button}`}
          >
            {hasRated ? "✅ Rated Successfully" : "⭐ Rate Dish"}
          </button>

          {showRating && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-3 flex space-x-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => handleRatingSubmit(num)}
                  className={`text-2xl ${num <= rating ? "text-yellow-400" : "text-gray-400"}`}
                >
                  ★
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 🍽 Top Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full md:w-1/3 h-[260px] object-cover rounded-xl shadow-xl border-4 border-white/60"
          />

          <div className="flex flex-col justify-center md:justify-start text-center md:text-left text-white drop-shadow-lg">
            <h1 className="text-5xl font-extrabold mb-3">{dish.name}</h1>

            <div className="flex items-center justify-center md:justify-start mb-4 gap-2">
              <span className={`w-3 h-3 rounded-full ${circle}`}></span>
              <span className={`px-4 py-1 rounded-full text-sm font-semibold shadow-md ${badge}`}>
                {dish.category}
              </span>
            </div>

            <span>
              <button
                onClick={() => navigate(`/guide/${id}`)}
                className="px-20 py-3 rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 text-black font-semibold shadow-md hover:scale-105 transition-transform duration-300"
              >
                🍳 Guide
              </button>
            </span>
          </div>
        </div>

        {/* 🎬 Video Link */}
        {dish.youtube && (
          <div className="mt-4 text-center md:text-left">
            <a
              href={dish.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-3 py-1.5 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition"
            >
              ▶ Watch Video
            </a>
          </div>
        )}

        {/* 🥗 Ingredients & Procedure */}
        <div className="flex flex-col md:flex-row md:divide-x md:divide-gray-400 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="w-full md:w-1/2 md:pr-6" ref={ingredientsRef}>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Ingredients</h2>
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

          <div className="w-full md:w-1/2 md:pl-6 mt-6 md:mt-0" ref={procedureRef}>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Cooking Procedure</h2>
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

        {/* 🍰 Extra Image */}
        {dish.extraImage && (
          <div className="w-full">
            <img
              src={dish.extraImage}
              alt="Extra"
              className="w-full h-[250px] object-cover rounded-xl shadow-lg border-4 border-white/60"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
