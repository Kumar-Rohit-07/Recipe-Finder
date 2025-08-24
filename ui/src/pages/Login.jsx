import React from "react";
import Navbar from "../components/Navbar";
import loginBg from "../assets/login img.png"; // make sure image is in assets folder
const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[radial-gradient(circle_at_center,_#414D85,_#191F40)] text-white">
      <Navbar />

      {/* Background Image (between gradient and login box) */}
      <img
        src={loginBg}
        alt="decor"
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none"
      />


      <div className="relative z-10 backdrop-blur-lg bg-white/10 p-10 rounded-2xl shadow-2xl border border-white/20 w-96 mt-12 min-h-[480px] flex flex-col">
        <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">Login</h2>
        <form className="flex flex-col space-y-12 mt-7">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white mt-5 mb-5"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white mt-5 mb-5"
          />
          <button className="px-4 py-3 rounded-lg  bg-white/20 border border-white/30 hover:bg-white/30 text-white font-semibold hover:opacity-90 transition mt-5 mb-5">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
