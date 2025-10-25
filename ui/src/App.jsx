import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Card from "./pages/card";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Details from "./pages/details";
import Guide from "./pages/Guide";
import Countries from "./pages/Countries";
import IngredientsPage from "./pages/IngredientsPage"; // ✅ NEW import

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔒 Protected Routes */}
          <Route
            path="/card/:category"
            element={
              <ProtectedRoute>
                <Card />
              </ProtectedRoute>
            }
          />

          <Route
            path="/countries"
            element={
              <ProtectedRoute>
                <Countries />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meal/:id"
            element={
              <ProtectedRoute>
                <Details />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guide/:id"
            element={
              <ProtectedRoute>
                <Guide />
              </ProtectedRoute>
            }
          />

          {/* ✅ Ingredients-based search page */}
          <Route
            path="/ingredients"
            element={
              <ProtectedRoute>
                <IngredientsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
