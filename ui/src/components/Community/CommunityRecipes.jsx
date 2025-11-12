import React, { useState, useEffect, useRef } from "react";
import API from "../../utils/api";
import RecipeCard from "./RecipeCard";
import UploadRecipeForm from "./UploadRecipeForm";
import { FaPlus } from "react-icons/fa";

const PAGE_SIZE = 6; // how many to show per “page” of scroll

const CommunityRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await API.get("/community/recipes");
        // ✅ backend returns an ARRAY
        setRecipes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load recipes", err);
      }
    };
    fetchRecipes();
  }, []);

  // Simple infinite scroll (client-side reveal)
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((v) => Math.min(v + PAGE_SIZE, recipes.length));
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(loadMoreRef.current);
    return () => io.disconnect();
  }, [recipes.length]);

  return (
    <div className="max-w-2xl mx-auto pb-20 pt-6">
      {/* Upload Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowUploadForm(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-full shadow-md transition"
        >
          <FaPlus /> Upload Recipe
        </button>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <UploadRecipeForm
          onClose={() => setShowUploadForm(false)}
          onUploaded={(newRecipe) => {
            // put new post at the top and reveal it
            setRecipes((prev) => [newRecipe, ...prev]);
            setVisibleCount((v) => Math.min(v + 1, recipes.length + 1));
          }}
        />
      )}

      {/* “Instagram-style” vertical feed */}
      <div className="space-y-8">
        {recipes.length > 0 ? (
          recipes.slice(0, visibleCount).map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))
        ) : (
          <p className="text-center text-gray-600">
            No recipes shared yet. Be the first! ✨
          </p>
        )}
      </div>

      {/* Sentinel for infinite scroll */}
      {visibleCount < recipes.length && (
        <div ref={loadMoreRef} className="h-10"></div>
      )}
    </div>
  );
};

export default CommunityRecipes;
