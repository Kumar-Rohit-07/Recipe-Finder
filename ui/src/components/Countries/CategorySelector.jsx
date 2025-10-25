import React from "react";

const CATEGORIES = ["all", "vegetarian", "non-veg", "desserts", "drinks"];

const CategorySelector = ({ selectedCategory, onChangeCategory }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-semibold">Select Category</label>
      <select
        value={selectedCategory}
        onChange={(e) => onChangeCategory(e.target.value)}
        className="px-3 py-2 border rounded shadow bg-gray-100 text-gray-800 focus:border-purple-600 focus:ring focus:ring-purple-300"
      >
        {CATEGORIES.map((cat, idx) => (
          <option key={idx} value={cat} className="bg-gray-50 text-gray-900">
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelector;
