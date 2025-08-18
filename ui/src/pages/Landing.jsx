import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-screen text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold mb-6"
        >
          Explore Delicious Recipes
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg max-w-2xl"
        >
          Discover vegetarian, non-veg, drinks and dessert recipes with smooth animations.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="mt-6 px-6 py-3 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 text-white hover:bg-white/20"
        >
          Explore Now
        </motion.button>
      </section>

      {/* Recipe Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-10 py-16">
        {["Vegetarian", "Non-Veg", "Drinks", "Dessert"].map((category, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 bg-white/10 border border-white/20 shadow-lg"
          >
            <h2 className="text-3xl font-semibold">{category}</h2>
            <p className="mt-2 text-gray-300">
              Explore the best {category} recipes curated for you.
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Landing;