// src/App.jsx - CORRECTED

import React from "react";
// 👇 No need to import BrowserRouter here anymore
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    // 👇 The extra Router has been removed
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;