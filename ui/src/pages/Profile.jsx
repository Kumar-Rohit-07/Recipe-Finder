import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react"; // 🆕 for edit icon

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [likedMeals, setLikedMeals] = useState([]);
  const [preview, setPreview] = useState(null); // 🆕 show preview before upload
  const [uploading, setUploading] = useState(false); // 🆕

  useEffect(() => {
    const fetchLikedRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/likes/liked", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLikedMeals(res.data);
      } catch (error) {
        console.error("Failed to load liked recipes:", error);
      }
    };

    fetchLikedRecipes();
  }, [user?.likedRecipes]);

  // 🆕 handle file change + upload
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.patch("http://localhost:5000/api/user/profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🆕 instantly update user profile image globally (AuthContext will pick it up)
      user.profilePic = res.data.imageUrl;
      localStorage.setItem("user", JSON.stringify(user)); // update stored user if you keep it
      window.location.reload(); // simplest way to refresh UI everywhere for now
    } catch (error) {
      console.error("Profile picture upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!user)
    return <div className="text-white text-center text-3xl mt-20">Loading Profile...</div>;

  return (
    <div className="min-h-screen p-10 text-white relative">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 text-white text-3xl hover:bg-white/10 px-4 py-2 rounded-full transition shadow-lg backdrop-blur-lg"
      >
        ←
      </button>

      {/* Header */}
<div className="text-center mb-12 relative">
  <div className="relative mx-auto w-28 h-28">
    <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl shadow-xl overflow-hidden border border-white/30">
      {/* Profile Image or Default Icon */}
      {user.profilePic ? (
        <img
          src={`http://localhost:5000${user.profilePic}`}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span>👤</span>
      )}
    </div>

    {/* 🆕 Edit Icon - just outside the circle */}
    <label
      htmlFor="profilePicInput"
      className="absolute -bottom-2 -right-2 bg-white text-gray-800 p-2 rounded-full shadow-md cursor-pointer hover:scale-105 hover:bg-gray-100 transition"
      title="Edit profile picture"
    >
      <Pencil size={18} strokeWidth={2} />
    </label>
    <input
      type="file"
      id="profilePicInput"
      accept="image/*"
      onChange={handleProfilePicChange}
      className="hidden"
    />
  </div>

  <h1 className="text-4xl font-bold mt-4 tracking-wide">{user.name}</h1>
  <p className="text-white/60">@{user.username}</p>

  {/* Uploading indicator */}
  {uploading && (
    <p className="text-sm text-white/60 mt-2 animate-pulse">Uploading image...</p>
  )}
</div>


      {/* Tabs */}
      <div className="flex justify-center gap-12 mb-12 text-xl">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-1 transition ${
            activeTab === "details"
              ? "border-b-4 border-white font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          Profile Details
        </button>
        <button
          onClick={() => setActiveTab("liked")}
          className={`pb-1 transition ${
            activeTab === "liked"
              ? "border-b-4 border-white font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          Liked Recipes ❤️
        </button>
      </div>

      {/* DETAILS TAB */}
      {activeTab === "details" && (
        <div className="max-w-lg mx-auto bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center space-y-4 animate-fadeIn">
          <p className="text-lg"><span className="font-semibold">Name:</span> {user.name}</p>
          <p className="text-lg"><span className="font-semibold">Email:</span> {user.email}</p>
          <p className="text-lg"><span className="font-semibold">Username:</span> {user.username}</p>

          <button
            onClick={logout}
            className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 transition rounded-lg font-semibold shadow-lg"
          >
            Logout
          </button>
        </div>
      )}

      {/* LIKED RECIPES TAB */}
      {activeTab === "liked" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 animate-fadeIn mt-4">
          {likedMeals.length > 0 ? (
            likedMeals.map((meal) => (
              <div
                key={meal._id}
                onClick={() => navigate(`/meal/${meal.idMeal}`)}
                className="cursor-pointer group rounded-xl overflow-hidden bg-white/10 backdrop-blur-xl 
                shadow-lg hover:shadow-2xl transition hover:-translate-y-2 flex flex-col"
              >
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="h-36 w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="p-3 flex flex-col text-center flex-1">
                  <h2 className="text-lg font-bold line-clamp-2">{meal.strMeal}</h2>
                  <p className="text-white/60 text-xs mt-1">{meal.strCategory}</p>
                  {meal.avgRating ? (
                    <p className="text-yellow-300 font-semibold text-sm mt-2">⭐ {meal.avgRating.toFixed(1)}</p>
                  ) : (
                    <p className="text-white/40 text-sm mt-2">No rating yet</p>
                  )}
                  <button className="mt-auto text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg transition">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-white/60 text-xl col-span-full mt-10">
              No liked recipes yet 💔
            </p>
          )}
        </div>
      )}
    </div>
  );
}
