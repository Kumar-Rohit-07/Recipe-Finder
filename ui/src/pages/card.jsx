import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Card = () => {
  const { category } = useParams(); 
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // drawer state

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

  if (loading) return <div className="text-white text-2xl">Loading...</div>;
  if (error) return <div className="text-red-500 text-2xl">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex justify-center relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed right-4 top-4 bg-white/20 text-white px-4 py-2 rounded-lg shadow-md hover:bg-white/30 transition z-50"
      >
        Menu
      </button>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-40 bg-gray-900 text-white shadow-xl transform transition-transform duration-300 z-40 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <span className="text-xl font-semibold"></span>
          <button onClick={() => setIsDrawerOpen(false)} className="text-white text-2xl">&times;</button>
        </div>
        <div className="flex flex-col mt-4 space-y-4 px-4">
          <button onClick={() => { navigate("/card/vegetarian"); setIsDrawerOpen(false); }} className="hover:bg-gray-700 p-2 rounded">Veg</button>
          <button onClick={() => { navigate("/card/non-veg"); setIsDrawerOpen(false); }} className="hover:bg-gray-700 p-2 rounded">Non-Veg</button>
          <button onClick={() => { navigate("/card/drinks"); setIsDrawerOpen(false); }} className="hover:bg-gray-700 p-2 rounded">Drinks</button>
          <button onClick={() => { navigate("/category/desserts"); setIsDrawerOpen(false); }} className="hover:bg-gray-700 p-2 rounded">Desserts</button>
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/50 z-30"
        ></div>
      )}

      {/* Main Card Content */}
      <div className="backdrop-blur-md bg-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-auto">
        <div className="grid grid-cols-5 gap-8 w-full pt-6"> 
          {meals.map((meal, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center rounded-xl bg-white/20 text-white font-semibold shadow-md hover:bg-white/30 transition p-4"
            >
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <span className="text-center">{meal.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
