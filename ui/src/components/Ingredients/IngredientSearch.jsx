import React, { useState } from "react";

const IngredientSearch = ({ onSearch }) => {
  const [ingredients, setIngredients] = useState("");
  const [aiCategory, setAiCategory] = useState("vegetarian");
  const [allergies, setAllergies] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🧹 Clean + normalize input before sending
    const formattedIngredients = ingredients
      .split(",")
      .map((i) => i.trim().toLowerCase())
      .filter(Boolean);

    const formattedAllergies = allergies
      .split(",")
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean);

    const formattedData = {
      ingredients: formattedIngredients,
      aiCategory: aiCategory.toLowerCase(),
      allergies: formattedAllergies,
    };

    console.log("🔹 handleSearch called with:", formattedData);

    onSearch(formattedData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl shadow-md w-full max-w-2xl mx-auto mt-10"
    >
      <h2 className="text-xl font-semibold mb-4 text-center text-white">
        🍽️ Search Dishes by Ingredients
      </h2>

      {/* Ingredients Input */}
      <div className="mb-4">
        <label className="block text-white mb-2">Ingredients you have:</label>
        <input
          type="text"
          placeholder="e.g. potatoes, onions, butter"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full bg-white text-black p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Type Dropdown */}
      <div className="mb-4">
        <label className="block text-white mb-2">Type:</label>
        <select
          value={aiCategory}
          onChange={(e) => setAiCategory(e.target.value)}
          className="w-full bg-white text-black p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="vegetarian">vegetarian</option>
          <option value="non-veg">non-veg</option>
          <option value="desserts">desserts</option>
          <option value="drinks">drinks</option>
        </select>
      </div>

      {/* Allergies Input */}
      <div className="mb-4">
        <label className="block text-white mb-2">Allergies (optional):</label>
        <input
          type="text"
          placeholder="e.g. milk, peanuts"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="w-full bg-white text-black p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md w-full font-medium transition"
      >
        Search
      </button>
    </form>
  );
};

export default IngredientSearch;
