/* src/pages/Login.jsx */
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion"; // ✅ for animation

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Toast states
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState(""); // "success" | "error"

  const showToast = (msg, type = "info") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMsg("");
      setToastType("");
    }, 2500); // auto hide after 2.5s
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => navigate("/"), 1800); // redirect after short delay
    } catch (err) {
      showToast(err.message || "Login failed!", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[radial-gradient(circle_at_center,_#414D85,_#191F40)] text-white">
      <Navbar />

      {/* Login Form */}
      <div className="relative z-10 backdrop-blur-lg bg-white/10 p-10 rounded-2xl shadow-2xl border border-white/20 w-96 flex flex-col">
        <h2 className="text-3xl font-bold mb-8 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-white/20 rounded text-white font-bold hover:bg-white/30 transition"
          >
            Login
          </button>
        </form>
      </div>

      {/* ✅ Animated Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ y: 0, opacity: 0, scale: 0.9 }}
            animate={{ y: -260, opacity: 1, scale: 1 }}
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

export default Login;
