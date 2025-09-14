/* src/pages/Card.jsx */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";

const Card = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // ✅ for profile
  const [menuOpen, setMenuOpen] = useState(false); // ✅ for menu
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/meals/category/${category}`);
        setMeals(res.data.meals);
      } catch (err) {
        setError("Failed to load meals");
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [category]);

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <div className="text-white text-2xl text-center mt-20">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-2xl text-center mt-20">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-animate">
      {/* ✅ Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-3xl bg-white/10 border-b border-white/20 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            🍴 Recipe Finder
          </Link>

          {/* ✅ Search Bar */}
          <div className="relative w-1/3 hidden md:block">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
              size={20}
              strokeWidth={2}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-12 pr-4 py-2 bg-white/20 border border-white/30 text-white placeholder-white rounded-full font-bold focus:outline-none hover:bg-white/30 transition"
            />
          </div>

          {/* ✅ Right Section */}
          <div className="flex items-center gap-2">
            {/* MENU Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="m-3 bg-white/20 text-white px-5 py-1.5 rounded-lg shadow-md hover:bg-white/30 transition"
              >
                MENU
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-50 bg-white/20 backdrop-blur-lg rounded-lg shadow-lg py-2 flex flex-col">
                  {["vegetarian", "non-veg", "drinks", "desserts"].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        navigate(`/card/${item}`);
                        setMenuOpen(false);
                      }}
                      className="text-white px-4 py-2 text-left hover:bg-white/30"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth/Profile */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
                >
                  Signup
                </Link>
              </>
            ) : (
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="text-xl">👤</span>
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
        </div>
      </nav>

      {/* ✅ Main Card Content */}
      <div className="flex-grow backdrop-blur-md bg-white/10 p-10 shadow-2xl overflow-auto hide-scrollbar pt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full">
          {filteredMeals.length > 0 ? (
            filteredMeals.map((meal, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-between rounded-xl bg-white/20 text-white font-semibold shadow-md hover:bg-white/30 transition p-4"
              >
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <span className="text-center mb-2">{meal.name}</span>
                {/* ✅ Updated navigation to details.jsx */}
                <button
                  onClick={() => navigate(`/meal/${meal.id}`)}
                  className="mt-auto px-4 py-2 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition duration-300 border border-white/10"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="flex items-center justify-center text-white text-xl col-span-full min-h-[60vh]">
              No recipes found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
