import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed  top-0 left-0 w-full z-50 backdrop-blur-3xl  bg-white/10 border-b border-white/20 backdrop-filter shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          🍴 Recipe Finder
        </Link>

        {/* Links */}
        <div className="flex space-x-12 text-white font-medium">
          <Link to="/">Veg</Link>
          <Link to="/">Non-Veg</Link>
          <Link to="/">Drinks</Link>
          <Link to="/">Dessert</Link>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-2xl bg-white/20 border border-white/30 text-white hover:bg-white/30 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-2xl bg-white/20 border border-white/30 text-white hover:bg-white/30 transition"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;