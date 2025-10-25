import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";
import IngredientSearch from "../components/Ingredients/IngredientSearch";
import DishResultCard from "../components/Ingredients/DishResultCard";

const IngredientsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

 const handleSearch = async (data) => {
  console.log("🔹 handleSearch called with:", data);
  console.log("🔹 Sending search data:", data);


  setLoading(true);
  setError(null);
  setResults([]);

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    console.log("📡 Sending request to backend...");
    console.log("📡 Sending to backend:", data);
    const res = await axios.post(
      "http://localhost:5000/api/ingredients/search",
      data,
      { headers }
    );
    console.log("✅ API response:", res.data);
    setResults(res.data.dishes || []); // ✅ fixed: only use array
  } catch (err) {
    console.error("❌ Ingredient search error:", err);
    console.log("Response data:", err.response?.data);
    setError(err.response?.data?.message || "Failed to fetch results");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen flex flex-col bg-animate">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-3xl bg-white/10 border-b border-white/20 shadow-md py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 relative">
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="fixed left-4 z-[9999] text-white hover:text-gray-300 transition md:left-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            🍴 Recipe Finder
          </Link>

          {/* Search Bar */}
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

          {/* Auth/Profile */}
          {!user ? (
            <div className="flex gap-2">
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
            </div>
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
      </nav>

      {/* Sidebar Overlay */}
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300"
          ></div>

          <div className="fixed top-0 left-0 h-full w-72 sm:w-80 bg-white/10 backdrop-blur-xl shadow-2xl border-r border-white/20 z-[9999] p-6 flex flex-col space-y-6 animate-slideIn md:rounded-r-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-wide">
                🍽 Menu
              </h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-gray-300 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              {[
                "vegetarian",
                "non-veg",
                "drinks",
                "desserts",
                "Find meals by ingredients",
                "countries",
                "team",
                "about",
              ].map((item) => {
                let label, path;
                switch (item) {
                    case "Find meals by ingredients":
                      label = "Find meals by ingredients";
                      path = "/ingredients";
                      break;
                  case "countries":
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

      {/* Main Content */}
      <div className="min-h-screen p-6 bg-gray-100 bg-animate mt-20 flex-grow py-10">
        <h1 className="text-4xl font-bold text-center mb-6 text-white">
          Ingredient-Based Dish Finder
        </h1>

        <IngredientSearch onSearch={handleSearch} />

        {loading && <p className="text-center text-xl text-white mt-6">Loading results...</p>}
        {error && <p className="text-center text-red-500 text-xl mt-6">{error}</p>}

        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
            {results.map((dish) => (
              <DishResultCard key={dish._id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientsPage;
