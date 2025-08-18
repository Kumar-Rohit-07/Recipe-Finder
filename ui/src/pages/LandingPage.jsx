// npm i framer-motion lucide-react
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import vegImg from "../assets/veg.jpg";
import nonVegImg from "../assets/non-veg.jpg";
import drinksImg from "../assets/drinks.jpg";
import dessertsImg from "../assets/dessert.jpeg";

// ---- CONFIG ----
const categories = [
  {
    name: "VEGETARIAN",
    image: vegImg,
    bg: "from-green-300 to-green-600",
    text: "text-white",
  },
  {
    name: "NON-VEG",
    image: nonVegImg,
    bg: "from-red-300 to-red-600",
    text: "text-white",
  },
  {
    name: "DRINKS",
    image: drinksImg,
    bg: "from-amber-300 to-amber-600",
    text: "text-white",
  },
  {
    name: "DESSERTS",
    image: dessertsImg,
    bg: "from-violet-300 to-violet-600",
    text: "text-white",
  },
];


// ---- PAGE ----
export default function LandingPage() {
  return (
    <>
      {/* Style tag to hide the scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      <Header />
      <main className="relative">
        <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
          {categories.map((cat) => (
            <Section key={cat.name} cat={cat} />
          ))}
        </div>
      </main>
    </>
  );
}

// ---- HEADER ----
const Header = () => (
  <motion.header
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-sm shadow-sm"
  >
    <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
      <a
        className="flex items-center text-2xl font-bold text-green-600"
        href="#"
      >
        <UtensilsCrossed className="mr-2 h-7 w-7" />
        RecipeFinder
      </a>
      <nav className="hidden items-center md:flex md:space-x-8">
        <a
          href="#"
          className="font-semibold text-gray-600 transition-colors duration-300 hover:text-green-600"
        >
          LOG IN
        </a>
        <a
          href="#"
          className="rounded-full border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors duration-300 hover:border-gray-400 hover:bg-gray-100"
        >
          SIGN UP
        </a>
      </nav>
    </div>
  </motion.header>
);

// ---- SECTION ----
const Section = ({ cat }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ref}
      className="relative flex h-screen snap-start items-center justify-center overflow-hidden pt-24"
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${cat.bg}`} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Big Title BEHIND the image */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className={`absolute top-1/4 md:top-1/5 text-6xl font-extrabold tracking-wider md:text-9xl ${cat.text} opacity-30 whitespace-nowrap`}
        >
          {cat.name}
        </motion.h1>

        {/* Image (Centered) */}
        <motion.img
  style={{ y }}
  src={cat.image}
  alt={cat.name}
  className="relative z-20 h-64 w-64 md:h-96 md:w-96 object-cover rounded-full shadow-xl bg-transparent"
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ amount: 0.5 }}
  transition={{ duration: 0.7, delay: 0.3 }}
/>




        {/* Button (Below image) */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 rounded-full border-2 border-white/60 bg-white/30 px-8 py-3 font-semibold text-white backdrop-blur-sm hover:bg-white/50"
        >
          EXPLORE NOW
        </motion.button>
      </div>
    </section>
  );
};
