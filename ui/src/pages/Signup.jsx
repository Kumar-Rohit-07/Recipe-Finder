<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import signupBg from "../assets/signupimg.png";
import { useAuth } from "../context/authContext.jsx";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await signup(name, username, email, password);
      setMessage({ type: "success", text: "Signup successful! Redirecting to login..." });
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setMessage({ type: "error", text: error.message });
      setIsLoading(false);
    }
  };

=======
import React from "react";
import Navbar from "../components/Navbar"; // optional background image like login
import signupBg from "../assets/signupimg.png";
const Signup = () => {
>>>>>>> d9c4b67965e69b95efad183255ce54d026e1d447
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[radial-gradient(circle_at_center,_#E287EA,_#971BA2)] text-white">
      <Navbar />

<<<<<<< HEAD
      {/* Background Image */}
=======
      {/* Background Image (between gradient and signup box) */}
>>>>>>> d9c4b67965e69b95efad183255ce54d026e1d447
      <img
        src={signupBg}
        alt="decor"
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none"
      />

<<<<<<< HEAD
      {/* Signup Box */}
      <div className="relative z-10 backdrop-blur-lg bg-white/10 p-10 rounded-2xl shadow-2xl border border-white/20 w-96 mt-12 min-h-[580px] flex flex-col">
        <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">Signup</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6 mt-2">
          <input
            type="text"
            placeholder="Full Name"
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 
                       focus:outline-none focus:ring-2 focus:ring-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Username"
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 
                       focus:outline-none focus:ring-2 focus:ring-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 
                       focus:outline-none focus:ring-2 focus:ring-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 
                       focus:outline-none focus:ring-2 focus:ring-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 
                       hover:bg-white/30 text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Signup"}
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

      <div className="relative z-10 backdrop-blur-lg bg-white/10 p-10 rounded-2xl shadow-2xl border border-white/20 w-96 mt-12 min-h-[520px] flex flex-col">
        <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">Signup</h2>
        <form className="flex flex-col space-y-8 mt-5">
          <input
            type="text"
            placeholder="Full Name"
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 hover:bg-white/30 text-white font-semibold hover:opacity-90 transition">
            Signup
          </button>
        </form>
>>>>>>> d9c4b67965e69b95efad183255ce54d026e1d447
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Signup;
=======
export default Signup;
>>>>>>> d9c4b67965e69b95efad183255ce54d026e1d447
