import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Card from "./pages/Card";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Details from "./pages/details";  // ✅ Dish details page
import Guide from "./pages/Guide";      // ✅ Import Guide page

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔒 Dynamic card page by category */}
          <Route
            path="/card/:category"
            element={
              <ProtectedRoute>
                <Card />
              </ProtectedRoute>
            }
          />

          {/* 🔒 Dish details page */}
          <Route
            path="/meal/:id"
            element={
              <ProtectedRoute>
                <Details />
              </ProtectedRoute>
            }
          />

          {/* 🔒 Guide page (step-by-step cooking) */}
          <Route
            path="/guide/:id"
            element={
              <ProtectedRoute>
                <Guide />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
