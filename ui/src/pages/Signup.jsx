import React from "react";
import Navbar from "../components/Navbar"; // optional background image like login
import signupBg from "../assets/signupimg.png";
const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[radial-gradient(circle_at_center,_#E287EA,_#971BA2)] text-white">
      <Navbar />

      {/* Background Image (between gradient and signup box) */}
      <img
        src={signupBg}
        alt="decor"
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none"
      />


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
      </div>
    </div>
  );
};

export default Signup;
