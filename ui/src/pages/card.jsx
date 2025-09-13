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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/meals/${category}`);
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

          {/* ✅ Right Section (MENU first, then Auth/Profile) */}
          <div className="flex items-center gap-2">
            {/* Drawer Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="m-3 bg-white/20 text-white px-5 py-2 rounded-lg shadow-md hover:bg-white/30 transition-duration-300"
            >
              MENU
            </button>

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

      {/* ✅ Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-40 bg-gray-900 text-white shadow-xl transform transition-transform duration-300 z-40 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <button onClick={() => setIsDrawerOpen(false)} className="text-white text-2xl">
            &times;
          </button>
        </div>
        <div className="flex flex-col mt-4 space-y-4 px-4">
          {["vegetarian", "non-veg", "drinks", "desserts"].map((item) => (
            <button
              key={item}
              onClick={() => {
                navigate(`/card/${item}`);
                setIsDrawerOpen(false);
              }}
              className="hover:bg-gray-700 p-2 rounded"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/50 z-30"
        ></div>
      )}

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
                <button
                  onClick={() => navigate(`/meal/${meal.id}`)}
                  className="mt-auto px-4 py-2 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition duration-300 border border-white/10"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-white text-xl col-span-full">
              No recipes found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
