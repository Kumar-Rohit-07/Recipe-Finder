import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import emptyHeart from "../assets/thumb-empty.svg";
import filledHeart from "../assets/thumb-filled.svg";

import confetti from "canvas-confetti";

const Details = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // robust id from url
  const id = (params.id || location.pathname.split("/").filter(Boolean).pop() || "").toString();

  // state
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showFullIngredients, setShowFullIngredients] = useState(false);
  const [showFullProcedure, setShowFullProcedure] = useState(false);

  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const [showToast, setShowToast] = useState(false);

  const ingredientsRef = useRef(null);
  const procedureRef = useRef(null);

  // fetch dish
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
        setError(null);
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

  // like/unlike toggle
  const toggleLike = async () => {
    if (!user) return alert("⚠ Login required to like recipes.");
    if (!dish?.idMeal) return;

    const mealId = dish.idMeal; // IMPORTANT: external idMeal (string)
    const token = localStorage.getItem("token");
    const likedList = user.likedRecipes || [];
    const isLikedNow = likedList.includes(mealId);

    try {
      if (isLikedNow) {
        // UNLIKE
        await axios.delete(`http://localhost:5000/api/likes/like/${mealId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ ...user, likedRecipes: likedList.filter((x) => x !== mealId) });
      } else {
        // LIKE
        await axios.post(
          `http://localhost:5000/api/likes/like/${mealId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser({ ...user, likedRecipes: [...likedList, mealId] });

        // confetti
        confetti({
          particleCount: 45,
          spread: 65,
          origin: { x: 0.95, y: 0.15 },
          startVelocity: 40,
        });

        // sparkle pulse on icon
        const heart = document.getElementById("likeHeart");
        if (heart) {
          heart.classList.add("sparkle");
          setTimeout(() => heart.classList.remove("sparkle"), 600);
        }

        // toast
        setShowToast(true);
        setTimeout(() => setShowToast(false), 1500);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // rating submit
  const handleRatingSubmit = async (value) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠ You must be logged in to rate.");
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

  // loading / error
  if (loading) return <div className="text-white text-2xl text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-2xl text-center">{error}</div>;
  if (!dish) return null;

  // category styling (kept same)
  const categoryRaw = dish.category?.trim().toLowerCase();
  let categoryKey = "other";
  if (["veg", "vegetarian"].includes(categoryRaw)) categoryKey = "veg";
  else if (["non-veg", "nonveg", "non vegetarian", "chicken", "meat"].includes(categoryRaw)) categoryKey = "nonveg";
  else if (["desserts", "dessert", "sweet"].includes(categoryRaw)) categoryKey = "dessert";
  else if (["drinks", "beverage", "juice", "mocktail"].includes(categoryRaw)) categoryKey = "drink";

  const categoryStyles = {
    veg: { gradient: "from-green-200 via-green-400 to-emerald-600", overlay: "bg-green-700/30" },
    nonveg: { gradient: "from-red-200 via-red-400 to-red-600", overlay: "bg-red-700/30" },
    dessert: { gradient: "from-purple-200 via-fuchsia-400 to-purple-700", overlay: "bg-purple-700/30" },
    drink: { gradient: "from-yellow-100 via-amber-300 to-orange-500", overlay: "bg-amber-600/30" },
    other: { gradient: "from-gray-200 via-gray-400 to-gray-600", overlay: "bg-gray-600/30" },
  };
  const { gradient, overlay } = categoryStyles[categoryKey];

  // compute liked state from user using idMeal
  const mealId = dish.idMeal;
  const isLiked = user?.likedRecipes?.includes(dish.idMeal);

  return (
    <div className="relative min-h-screen w-full p-6 flex flex-col items-center text-gray-900 overflow-hidden">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 text-white text-3xl hover:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full transition shadow-lg"
      >
        ←
      </button>

      {/* Like button (image-based) */}
      <button
        onClick={toggleLike}
        className={`fixed top-6 right-6 z-50 flex items-center justify-center 
        w-14 h-14 rounded-full shadow-xl backdrop-blur-lg transition-transform duration-300
        ${isLiked ? "scale-110" : "hover:bg-white/40"}`}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        <img
          id="likeHeart"
          src={isLiked ? filledHeart : emptyHeart}
          className="w-9 h-9 transition-transform duration-300"
          alt="like"
        />
      </button>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 z-[9999] px-5 py-2 rounded-lg bg-green-600 text-white text-lg font-medium shadow-lg animate-toast">
          ✅ Added to Liked Recipes!
        </div>
      )}

      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className={`absolute w-[200%] h-[200%] bg-gradient-to-r ${gradient} blur-3xl opacity-60 animate-wave1`} />
        <div className={`absolute w-[200%] h-[200%] bg-gradient-to-l ${gradient} blur-2xl opacity-50 animate-wave2`} />
      </div>
      <div className={`absolute inset-0 ${overlay} -z-5`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_65%,rgba(0,0,0,0.4)_100%)] -z-5" />

      {/* Content */}
      <div className="w-full max-w-6xl flex flex-col gap-8 relative text-white drop-shadow-lg pr-6">
        {/* Dish Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full md:w-1/3 h-[260px] object-cover rounded-xl shadow-xl border-4 border-white/60"
          />

          <div className="flex flex-col justify-center md:justify-start text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-3">{dish.name}</h1>

            <div className="flex items-center justify-center md:justify-start mb-4 gap-2">
              <span className="w-3 h-3 rounded-full bg-white" />
              <span className="px-4 py-1 rounded-full text-sm font-semibold shadow-md bg-white/30 backdrop-blur-md">
                {dish.category}
              </span>
            </div>

            {/* Guide / Video / Rate */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-4">
              <button
                onClick={() => navigate(`/guide/${id}`)}
                className="px-5 py-2 rounded-full font-semibold shadow-lg text-white 
                bg-gradient-to-r from-green-300 via-green-500 to-green-700 
                hover:from-green-400 hover:via-green-600 hover:to-green-800 
                transition-all duration-300"
              >
                🍳 Guide
              </button>

              {dish.youtube && (
                <a
                  href={dish.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-full font-semibold shadow-lg text-white 
                  bg-gradient-to-r from-red-300 via-red-500 to-red-700 
                  hover:from-red-400 hover:via-red-600 hover:to-red-800 
                  transition-all duration-300"
                >
                  ▶ Watch Video
                </a>
              )}

              {/* Rate */}
              <div className="relative">
                <button
                  onClick={() => setShowRating((s) => !s)}
                  className="px-5 py-2 rounded-full font-semibold shadow-lg text-white 
                  bg-gradient-to-r from-green-300 via-green-500 to-green-700 
                  hover:from-green-400 hover:via-green-600 hover:to-green-800 
                  transition-all duration-300"
                >
                  {hasRated ? "✅ Rated" : "⭐ Rate Dish"}
                </button>

                {showRating && (
                  <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg p-3 flex space-x-1">
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
            </div>
          </div>
        </div>

        {/* Ingredients / Procedure */}
        <div className="flex flex-col md:flex-row md:divide-x md:divide-white/30 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="w-full md:w-1/2 md:pr-6" ref={ingredientsRef}>
            <h2 className="text-2xl font-semibold mb-3 text-white">Ingredients</h2>
            <ul
              className={`list-disc pl-6 space-y-1 transition-all duration-500 ${
                showFullIngredients ? "max-h-full" : "max-h-40 overflow-hidden"
              }`}
            >
              {dish.ingredients?.map((item, index) => (
                <li key={index}>
                  {item}{" "}
                  {dish.measures?.[index] ? (
                    <span className="text-white/80">– {dish.measures[index]}</span>
                  ) : null}
                </li>
              ))}

            </ul>
            {dish.ingredients?.length > 8 && (
              <button
                onClick={() => {
                  setShowFullIngredients((v) => !v);
                  setTimeout(() => ingredientsRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
                }}
                className="mt-3 px-4 py-1 bg-white/20 text-white rounded-full shadow-lg hover:bg-white/30 backdrop-blur-md transition-all"
              >
                {showFullIngredients ? "Read Less" : "Read More"}
              </button>
            )}
          </div>

          <div className="w-full md:w-1/2 md:pl-6 mt-6 md:mt-0" ref={procedureRef}>
            <h2 className="text-2xl font-semibold mb-3 text-white">Cooking Procedure</h2>
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
                  setShowFullProcedure((v) => !v);
                  setTimeout(() => procedureRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
                }}
                className="mt-3 px-4 py-1 bg-white/20 text-white rounded-full shadow-lg hover:bg-white/30 backdrop-blur-md transition-all"
              >
                {showFullProcedure ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        </div>

        {/* Extra image */}
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

      {/* Keyframes */}
      <style>{`
        /* confetti/sparkle helper */
        .sparkle { animation: sparklePulse 0.5s ease; }
        @keyframes sparklePulse {
          0% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.3); filter: brightness(1.6); }
          100% { transform: scale(1); filter: brightness(1); }
        }

        /* toast */
        @keyframes toastPop {
          0% { transform: translateY(-20px); opacity: 0; }
          15% { transform: translateY(0); opacity: 1; }
          85% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        .animate-toast { animation: toastPop 1.5s ease forwards; }

        /* bg waves */
        @keyframes wave1 {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(-25%) translateY(-10%) rotate(8deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }
        @keyframes wave2 {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(25%) translateY(10%) rotate(-8deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }
        .animate-wave1 { animation: wave1 14s ease-in-out infinite; }
        .animate-wave2 { animation: wave2 18s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Details;
