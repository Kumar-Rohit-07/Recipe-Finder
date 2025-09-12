import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

// 🖼️ Images
import vegImg from "../assets/VEGTHALI.png";
import nonVegImg from "../assets/CHICKEN.png";
import drinksImg from "../assets/MILK.png";
import dessertsImg from "../assets/ICECREAM.png";

// 🖼️ Overlay Images
import vegBars from "../assets/Screenshot_2025-08-20_210556-removebg-preview.png";
import redBars from "../assets/red.png";
import yellowBars from "../assets/yellow.png";
import purpleBars from "../assets/purp.png";

// ---- CONFIG ----
const categories = [
  {
    name: "vegetarian",
    image: vegImg,
    overlay: vegBars,
    bg: "bg-[radial-gradient(circle_at_center,_#86efac,_#16a34a)]",
    text: "text-white",
  },
  {
    name: "non-veg",
    image: nonVegImg,
    overlay: redBars,
    bg: "bg-[radial-gradient(circle_at_center,_#fca5a5,_#b91c1c)]",
    text: "text-white",
  },
  {
    name: "drinks",
    image: drinksImg,
    overlay: yellowBars,
    bg: "bg-[radial-gradient(circle_at_center,_#fde68a,_#b45309)]",
    text: "text-white",
  },
  {
    name: "desserts",
    image: dessertsImg,
    overlay: purpleBars,
    bg: "bg-[radial-gradient(circle_at_center,_#c4b5fd,_#5b21b6)]",
    text: "text-white",
  },
];

// ---- PAGE ----
export default function LandingPage() {
  const location = useLocation();

  // Scroll to section if passed via navigation state
  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.state]);

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  
          scrollbar-width: none;  
        }
      `}</style>

      <Navbar />

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

// ---- SECTION COMPONENT ----
const Section = ({ cat }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const navigate = useNavigate();
  const { token } = useAuth();

  // ✅ Pass category to Card page
  const handleExplore = () => {
  if (token) {
    navigate(`/card/${cat.name}`); // ✅ Pass category in URL
  } else {
    navigate("/login"); // ❌ Not logged in → redirect to login
  }
};


  return (
    <section
      ref={ref}
      id={cat.name.toLowerCase()}
      className="relative flex h-screen snap-start items-center justify-center overflow-hidden pt-24"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 ${cat.bg} z-0`} />

      {/* Overlay Image */}
      {cat.overlay && (
        <motion.img
          src={cat.overlay}
          alt={`${cat.name} overlay`}
          className="absolute inset-0 w-full h-full object-cover z-10 opacity-27"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.27, scale: 1 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className={`absolute top-1/4 md:top-1/5 text-6xl font-extrabold tracking-wider md:text-9xl ${cat.text} opacity-30 whitespace-nowrap z-20`}
        >
          {cat.name.toUpperCase()}
        </motion.h1>

        <motion.div
          style={{ y }}
          className="relative z-30 h-64 w-64 md:h-96 md:w-96 rounded-full overflow-hidden shadow-xl bg-transparent flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <img
            src={cat.image}
            alt={cat.name}
            className="h-full w-full object-contain"
          />
        </motion.div>

        <motion.button
          onClick={handleExplore}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 z-40 rounded-full border-2 border-white/60 bg-white/30 px-8 py-3 font-semibold text-white backdrop-blur-sm hover:bg-white/50"
        >
          EXPLORE NOW
        </motion.button>
      </div>
    </section>
  );
};
