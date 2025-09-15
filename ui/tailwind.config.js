/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pulseGlowGreen: {
          "0%, 100%": { boxShadow: "0 0 10px #22c55e, 0 0 20px #15803d" },
          "50%": { boxShadow: "0 0 20px #4ade80, 0 0 40px #22c55e" },
        },
        pulseGlowRed: {
          "0%, 100%": { boxShadow: "0 0 10px #ef4444, 0 0 20px #991b1b" },
          "50%": { boxShadow: "0 0 20px #f87171, 0 0 40px #ef4444" },
        },
        pulseGlowPink: {
          "0%, 100%": { boxShadow: "0 0 10px #ec4899, 0 0 20px #831843" },
          "50%": { boxShadow: "0 0 20px #f472b6, 0 0 40px #ec4899" },
        },
        pulseGlowBlue: {
          "0%, 100%": { boxShadow: "0 0 10px #3b82f6, 0 0 20px #1e3a8a" },
          "50%": { boxShadow: "0 0 20px #60a5fa, 0 0 40px #3b82f6" },
        },
        pulseGlowGray: {
          "0%, 100%": { boxShadow: "0 0 10px #6b7280, 0 0 20px #111827" },
          "50%": { boxShadow: "0 0 20px #9ca3af, 0 0 40px #6b7280" },
        },
      },
      animation: {
        pulseGlowGreen: "pulseGlowGreen 2s ease-in-out infinite",
        pulseGlowRed: "pulseGlowRed 2s ease-in-out infinite",
        pulseGlowPink: "pulseGlowPink 2s ease-in-out infinite",
        pulseGlowBlue: "pulseGlowBlue 2s ease-in-out infinite",
        pulseGlowGray: "pulseGlowGray 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("daisyui")], // ✅ keep DaisyUI
};
