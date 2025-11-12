import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // ✅ clean icon

import CommunityRecipes from "../components/Community/CommunityRecipes";
import ChatBox from "../components/Community/CommunityChat.jsx";

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recipes");

  return (
    <section className="relative py-16 px-4 md:px-8 lg:px-16 min-h-screen overflow-auto bg-gradient-to-br from-teal-50 via-white to-teal-100 text-gray-800">
      
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-full shadow-md hover:bg-gray-800 transition"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium hidden sm:inline">Back</span>
      </button>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-teal-700 mb-4 drop-shadow-sm">
          🌿 Community
        </h2>
        <p className="text-center text-gray-600 mb-10 text-lg">
          Share recipes & chat with fellow food lovers 🍲💬
        </p>

        {/* 🔥 TAB SWITCH */}
        <div className="flex justify-center gap-6 text-lg font-semibold mb-8">
          <button
            onClick={() => setActiveTab("recipes")}
            className={`px-2 pb-1 transition ${
              activeTab === "recipes"
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-500 hover:text-teal-600"
            }`}
          >
            Recipes
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`px-2 pb-1 transition ${
              activeTab === "chat"
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-500 hover:text-teal-600"
            }`}
          >
            Chat
          </button>
        </div>

        {/* ✅ TAB CONTENTS */}
        {activeTab === "recipes" && <CommunityRecipes />}
        {activeTab === "chat" && <ChatBox />}
      </div>
    </section>
  );
};

export default Community;
