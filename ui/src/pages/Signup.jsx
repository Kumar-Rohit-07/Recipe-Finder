/* src/pages/Signup.jsx */
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import signupBg from "../assets/signupimg.png";
import { motion, AnimatePresence } from "framer-motion"; // ✅ for animation

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Toast states
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState(""); // "success" | "error" | "info"

  const showToast = (msg, type = "info") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMsg("");
      setToastType("");
    }, 2500); // auto hide
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, username, email, password);
      showToast("Signup successful! Please login.", "success");
      setTimeout(() => navigate("/login"), 1800); // redirect after short delay
    } catch (err) {
      showToast(err.message || "Signup failed!", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[radial-gradient(circle_at_center,_#E287EA,_#971BA2)] text-white">
      <Navbar />

      {/* Background image */}
      <img
        src={signupBg}
        alt="decor"
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none"
      />

      {/* Signup form */}
      <div className="relative z-10 backdrop-blur-lg bg-white/10 p-10 rounded-2xl shadow-2xl border border-white/20 w-96 mt-12 min-h-[520px] flex flex-col">
        <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">
          Signup
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <button
            type="submit"
            className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 hover:bg-white/30 text-white font-semibold hover:opacity-90 transition"
          >
            Signup
          </button>
        </form>
      </div>

      {/* ✅ Toast with animation */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ y: 0, opacity: 0, scale: 0.9 }}
            animate={{ y: -280, opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-x-0 flex justify-center z-50"
          >
            <div
              className={`alert shadow-lg border ${
                toastType === "success"
                  ? "bg-white text-green-600 border-green-400"
                  : toastType === "error"
                  ? "bg-white text-red-600 border-red-400"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              <span>{toastMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Signup;
