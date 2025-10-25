import React from "react";
import DishCard from "../Countries/DishCard";

const DishList = ({ recommended = [], allDishes = [] }) => {
  return (
    <div className="flex flex-col gap-8">
      {recommended.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">⭐ Recommended</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommended.map(dish => (
              <DishCard key={dish.idMeal} dish={dish} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">🍽 All Dishes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allDishes.map(dish => (
            <DishCard key={dish.idMeal} dish={dish} />
          ))}
        </div>
      </div>
    </div>
  );
};


export default DishList;
