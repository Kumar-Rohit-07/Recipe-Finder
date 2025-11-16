/* src/context/AuthContext.jsx */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API_URL = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // ✅ Keep localStorage synced when user changes
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // ✅ If token removed → logout user
  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [token]);

  // 🧠 Sync updated profile from backend (especially for profilePic)
  const refreshUserProfile = async () => {  // 🆕
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("❌ Failed to refresh user profile:", err.message);
    }
  };

  // Signup
  const signup = async (name, username, email, password) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/signup`, { name, username, email, password });
    } catch (err) {
      throw new Error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });

      // 🆕 backend should now return { token, user: { ... , profilePic } }
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      return user;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        signup,
        logout,
        loading,
        refreshUserProfile, // 🆕 expose function so you can re-sync after profile upload
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
