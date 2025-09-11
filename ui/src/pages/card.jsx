import React from "react";
import bgImage from "../assets/carrd.jpg"; // ✅ use your uploaded image path

const Card = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Transparent Card Container */}
      <div className="backdrop-blur-md bg-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex items-center justify-center">
        {/* Grid Layout: 3 rows × 5 columns */}
        <div className="grid grid-cols-5 grid-rows-3 gap-8 w-full h-full">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-xl bg-white/20 text-white font-semibold shadow-md hover:bg-white/30 transition text-lg p-10"
            >
              Item {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
