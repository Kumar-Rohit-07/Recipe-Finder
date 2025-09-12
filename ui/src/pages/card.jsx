import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Card = () => {
  const { category } = useParams(); // ✅ get category from URL
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/meals/${category}`);
        setMeals(res.data.meals); // assuming backend returns { meals: [...] }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex justify-center">
      <div className="backdrop-blur-md bg-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-auto">
        <div className="grid grid-cols-5 gap-8 w-full pt-6"> 
          {/* 🔑 added pt-6 padding so top row is visible */}
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
