import axios from "axios";

// REST API client
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // adjust if you store it elsewhere
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Derive socket server URL by stripping `/api`
export const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api")
  .replace(/\/api$/, ""); 

export default API;
