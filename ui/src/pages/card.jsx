/* src/pages/Card.jsx */
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Search, Bot, Star, MapPin } from "lucide-react";

const Card = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/meals/category/${category}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const rawMeals = res.data.meals || [];
        const formattedMeals = rawMeals.map((m) => ({
          id: m.idMeal || m._id,
          name: m.strMeal || m.name || "Unnamed Meal",
          image:
            m.strMealThumb ||
            m.image ||
            "https://via.placeholder.com/300x200?text=No+Image",
          description:
            m.description ||
            (m.strInstructions
              ? m.strInstructions.slice(0, 80) + "..."
              : "Delicious recipe to try out!"),
          avgRating:
            !isNaN(parseFloat(m.avgRating)) && m.avgRating !== null
              ? parseFloat(m.avgRating)
              : 0,
          aiCategory: m.aiCategory || m.strCategory || "Misc",
        }));
        formattedMeals.sort((a, b) => b.avgRating - a.avgRating);
        setMeals(formattedMeals);
      } catch (err) {
        setError("Failed to load meals. Try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [category]);

  const filteredMeals = meals.filter((meal) =>
    meal.name?.toLowerCase().includes(search.toLowerCase())
  );

  const top5MealIds = [...meals]
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5)
    .map((m) => m.id);

  if (loading)
    return (
      <div className="text-white text-2xl text-center mt-20">Loading...</div>
    );
  if (error)
    return (
      <div className="text-red-500 text-2xl text-center mt-20">{error}</div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-animate">
      {/* 🌐 Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-2xl bg-white/10 border-b border-white/20 shadow-md py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-1 relative">
          {/* 🍔 Hamburger Icon */}
          {/* 🍔 Hamburger Icon */}
            <button
              onClick={() => setMenuOpen(true)}
              className="fixed left-4 text-white hover:text-gray-300 transition text-2xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* 🍴 Logo */}
            <Link
              to="/"
              className="text-lg sm:text-xl font-bold text-white tracking-wide"
            >
              🍴 Recipe Finder
            </Link>


          {/* 🔍 Search (Hidden on mobile) */}
          <div className="relative hidden sm:block w-1/3">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
              size={18}
              strokeWidth={2}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-10 pr-4 py-1.5 bg-white/20 border border-white/30 text-white placeholder-white rounded-full text-sm focus:outline-none hover:bg-white/30 transition"
            />
          </div>

          {/* 🔗 Buttons + Profile */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/countries"
              className="flex items-center gap-2 text-white font-semibold py-1.5 px-4 rounded-full 
                bg-white/10 backdrop-blur-md border border-white/30 shadow-md 
                hover:bg-white/20 hover:shadow-lg hover:scale-105 transition duration-300"
            >
              <MapPin size={18} className="text-yellow-300" />
              <span className="font-semibold">Cuisine</span>
            </Link>

            <Link
              to="/community"
              className="flex items-center gap-2 text-white font-semibold py-1.5 px-4 rounded-full 
                bg-white/10 backdrop-blur-md border border-white/30 shadow-md 
                hover:bg-white/20 hover:shadow-lg hover:scale-105 transition duration-300"
            >
              <span className="text-pink-300 text-lg">💬</span>
              <span className="font-semibold">Community</span>
            </Link>
          </div>

          {/* 👤 Auth/Profile */}
          {!user ? (
            <div className="flex gap-2 text-sm">
              <Link
                to="/login"
                className="px-3 py-1 rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1 rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
              >
                Signup
              </Link>
            </div>
          ) : (
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.profilePic ? (
                  <img
                    src={`http://localhost:5000${user.profilePic}`}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-lg">👤</span>
                )}
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white/20 backdrop-blur-lg rounded-lg shadow-lg py-2 flex flex-col">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                    className="text-white px-4 py-2 text-left hover:bg-white/30"
                  >
                    Your Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login", { replace: true });
                      setDropdownOpen(false);
                    }}
                    className="text-white px-4 py-2 text-left hover:bg-white/30"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🔍 Search bar visible on mobile */}
        <div className="sm:hidden px-4 mt-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
              size={16}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-8 pr-3 py-2 bg-white/20 text-white rounded-full text-sm placeholder-white focus:outline-none border border-white/30"
            />
          </div>
        </div>
      </nav>

      {/* 📱 Sidebar for mobile */}
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300"
          ></div>

          <div className="fixed top-0 left-0 h-full w-72 bg-white/10 backdrop-blur-xl shadow-2xl border-r border-white/20 z-[9999] p-6 flex flex-col space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">🍽 Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-gray-300 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              {[
                "Home",
                "vegetarian",
                "non-veg",
                "drinks",
                "desserts",
                "Find meals by ingredients",
                "restaurants",
                "team",
                "about",
              ].map((item) => {
                let label, path;
                switch (item) {
                  case "Home":
                    label = "Home";
                    path = "/";
                    break;
                  case "Find meals by ingredients":
                    label = "Find meals by ingredients";
                    path = "/ingredients";
                    break;
                  case "restaurants":
                    label = "Cuisine Explorer";
                    path = "/countries";
                    break;
                  case "team":
                    label = "Team";
                    path = "/team";
                    break;
                  case "about":
                    label = "About Us";
                    path = "/about";
                    break;
                  default:
                    label = item.charAt(0).toUpperCase() + item.slice(1);
                    path = `/card/${item}`;
                }
                return (
                  <button
                    key={item}
                    onClick={() => {
                      navigate(path);
                      setMenuOpen(false);
                    }}
                    className="text-left text-lg text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* 🧩 Main Grid */}
      <div className="flex-grow backdrop-blur-md bg-white/10 m-4 sm:m-10 shadow-2xl overflow-auto hide-scrollbar pt-28 sm:pt-24 rounded-xl">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 w-full p-3 sm:p-4">
          {filteredMeals.length > 0 ? (
            filteredMeals.map((meal, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center justify-between rounded-xl bg-white/20 text-white font-semibold shadow-md hover:bg-white/30 transition p-4"
              >
                {top5MealIds.includes(meal.id) && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow">
                    ⭐ Recommended
                  </span>
                )}
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-40 sm:h-32 object-cover rounded-md mb-2"
                />
                <span className="text-center text-base sm:text-lg font-bold mb-2">
                  {meal.name}
                </span>
                <div className="flex items-center justify-between space-x-1 mb-2">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span>
                    {meal.avgRating > 0
                      ? meal.avgRating.toFixed(1)
                      : "N/A"}
                  </span>
                  <span className="text-white/70 text-sm">
                    ({meal.totalRatings || 0})
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/meal/${meal.id}`)}
                  className="mt-auto px-4 py-2 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition duration-300 border border-white/10"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-white text-xl col-span-full text-center min-h-[60vh]">
              No recipes found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
