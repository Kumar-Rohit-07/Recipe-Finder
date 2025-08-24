/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
// ❌ No longer need useNavigate here
// import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const authContext = createContext();
export const useAuth = () => useContext(authContext);

const API_URL = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  // ❌ No longer need to initialize navigate here
  // const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, [token]);

  // Signup
  const signup = async (name, username, email, password) => {
    try {
      await axios.post(`${API_URL}/signup`, { name, username, email, password });
      // ❌ Navigation removed
    } catch (err) {
      // ✅ Throw error instead of alerting
      throw new Error(err.response?.data?.message || "Signup failed");
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      // ❌ Navigation removed
    } catch (err) {
      // ✅ Throw error instead of alerting
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <authContext.Provider value={{ user, token, signup, login }}>
      {children}
    </authContext.Provider>
  );
};