/* src/pages/Login.jsx */
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[radial-gradient(circle_at_center,_#414D85,_#191F40)] text-white">
      <Navbar />
      <div className="relative z-10 backdrop-blur-lg bg-white/10 p-10 rounded-2xl shadow-2xl border border-white/20 w-96 flex flex-col">
        <h2 className="text-3xl font-bold mb-8 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded bg-white/20 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded bg-white/20 text-white"
          />
          <button type="submit" className="px-4 py-2 bg-white/20 rounded text-white font-bold hover:bg-white/30">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
