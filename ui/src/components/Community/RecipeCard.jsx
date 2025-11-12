import React, { useState } from "react";
import CommentSection from "./CommentSection";
import { SOCKET_URL } from "../../utils/api";

const RecipeCard = ({ recipe }) => {
  const [showComments, setShowComments] = useState(false);

  // Build absolute image URL if backend sent a relative path like /uploads/...
  const imgSrc = recipe?.image?.startsWith("http")
    ? recipe.image
    : `${SOCKET_URL}${recipe.image || ""}`;

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      {/* Header */}
        <div className="flex items-center gap-3 p-4">
        {recipe?.user?.profilePic ? (
            <img
            src={
                recipe.user.profilePic.startsWith("http")
                ? recipe.user.profilePic
                : `${SOCKET_URL}${recipe.user.profilePic}`
            }
            alt="user"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
        ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            👤
            </div>
        )}

        <div>
            <p className="font-semibold text-gray-800">
            {recipe?.user?.name || "Unknown Chef"}
            </p>
            <p className="text-xs text-gray-500">
            {recipe?.country || "Unknown Region"}
            </p>
        </div>
        </div>


      {/* Image */}
      <img
        src={imgSrc}
        alt={recipe?.name}
        className="w-full max-h-[520px] object-cover bg-gray-100"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/800x500?text=Image";
        }}
      />

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{recipe?.name}</h2>
        <p className="text-gray-600 text-sm mb-4 capitalize">{recipe?.category}</p>

        {/* Ingredients */}
        <p className="text-gray-800 font-semibold mb-1">Ingredients:</p>
        <ul className="text-gray-700 text-sm list-disc ml-5">
          {(recipe?.ingredients ?? []).map((ing, i) => (
            <li key={i}>
              {ing.ingredient} - {ing.measure}
            </li>
          ))}
        </ul>

        {/* Procedure */}
        <p className="text-gray-800 font-semibold mt-3 mb-1">Procedure:</p>
        <ol className="text-gray-700 text-sm list-decimal ml-5">
          {(recipe?.steps ?? []).map((step, i) => (
            <li key={i} className="mb-1">
              {step}
            </li>
          ))}
        </ol>

        {/* Comments Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-teal-600 font-semibold mt-4"
        >
          {showComments ? "Hide Comments" : "View Comments"}
        </button>

        {showComments && <CommentSection recipeId={recipe._id} />}
      </div>
    </div>
  );
};

export default RecipeCard;
