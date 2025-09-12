<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import loginBg from "../assets/login img.png";
import { useAuth } from "../context/authContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await login(email, password);
      setMessage({ type: "success", text: "Login successful! Redirecting..." });

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      setMessage({ type: "error", text: error.message });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[radial-gradient(circle_at_center,_#414D85,_#191F40)] text-white">
      <Navbar />
=======
import React from "react";
import Navbar from "../components/Navbar";
import loginBg from "../assets/login img.png"; // make sure image is in assets folder
const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[radial-gradient(circle_at_center,_#414D85,_#191F40)] text-white">
      <Navbar />

      {/* Background Image (between gradient and login box) */}
>>>>>>> d9c4b67965e69b95efad183255ce54d026e1d447
      <img
        src={loginBg}
        alt="decor"
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none"
      />
<<<<<<< HEAD
      <div className="relative z-10 backdrop-blur-lg bg-white/10 p-10 rounded-2xl shadow-2xl border border-white/20 w-96 mt-12 min-h-[480px] flex flex-col">
        <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6 mt-4">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
=======


      <div className="relative z-10 backdrop-blur-lg bg-white/10 p-10 rounded-2xl shadow-2xl border border-white/20 w-96 mt-12 min-h-[480px] flex flex-col">
        <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">Login</h2>
        <form className="flex flex-col space-y-12 mt-7">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white mt-5 mb-5"
>>>>>>> d9c4b67965e69b95efad183255ce54d026e1d447
          />
          <input
            type="password"
            placeholder="Password"
<<<<<<< HEAD
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 hover:bg-white/30 text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        {/* Display the message here */}
        {message.text && (
          <p className={`mt-4 text-center ${
              message.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message.text}
          </p>
        )}
=======
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white mt-5 mb-5"
          />
          <button className="px-4 py-3 rounded-lg  bg-white/20 border border-white/30 hover:bg-white/30 text-white font-semibold hover:opacity-90 transition mt-5 mb-5">
            Login
          </button>
        </form>
>>>>>>> d9c4b67965e69b95efad183255ce54d026e1d447
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> d9c4b67965e69b95efad183255ce54d026e1d447
