import React from "react";
import Navbar from "../components/Navbar";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />
      <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl border border-white/20 w-96 mt-20">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <form className="flex flex-col space-y-4">
          <input type="email" placeholder="Email" className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30" />
          <input type="password" placeholder="Password" className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30" />
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;