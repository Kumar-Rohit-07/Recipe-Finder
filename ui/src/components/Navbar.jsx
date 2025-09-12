/* src/components/Navbar.jsx */
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const categories = [
  { name: "Veg", path: "vegetarian" },
  { name: "Non-Veg", path: "non-veg" },
  { name: "Drinks", path: "drinks" },
  { name: "Dessert", path: "desserts" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (id) => {
    if (location.pathname === "/") scrollToSection(id);
    else navigate("/", { state: { scrollTo: id } });
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-3xl bg-white/10 border-b border-white/20 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-3">
        <Link to="/" className="text-2xl font-bold text-white">🍴 Recipe Finder</Link>

        <div className="hidden md:flex space-x-12 text-white font-medium">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleNavClick(cat.path)}
              className="hover:text-gray-300 transition-colors"
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center relative">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-2xl bg-white/20 border border-white/30 text-white hover:bg-white/30 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="ml-2 px-4 py-2 rounded-2xl bg-white/20 border border-white/30 text-white hover:bg-white/30 transition"
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
                    onClick={handleLogout}
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
  );
};

export default Navbar;
