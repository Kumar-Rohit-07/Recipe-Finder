// src/pages/details.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Details = () => {
  const { id } = useParams(); // ✅ get dish id from URL
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        // ✅ API call for specific dish
        const res = await axios.get(`http://localhost:5000/api/meals/meal/${id}`);
        setDish(res.data); // assume API returns a single dish object
      } catch (err) {
        setError("Failed to load dish details");
      } finally {
        setLoading(false);
      }
    };
    fetchDish();
  }, [id]);

  if (loading) return <div className="text-white text-2xl">Loading...</div>;
  if (error) return <div className="text-red-500 text-2xl">{error}</div>;
  if (!dish) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-animate p-6">
      <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-xl p-6 w-full max-w-3xl text-white">
        {/* Dish Image */}
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        {/* Dish Name */}
        <h1 className="text-3xl font-bold mb-4 text-center">{dish.name}</h1>

        {/* Ingredients */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc pl-6 space-y-1">
            {dish.ingredients?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Cooking Procedure */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Cooking Procedure</h2>
          <p className="leading-relaxed">{dish.procedure}</p>
        </div>
      </div>
    </div>
  );
};

export default Details;
