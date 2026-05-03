import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://team-task-manager-production-a7ca.up.railway.app";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;