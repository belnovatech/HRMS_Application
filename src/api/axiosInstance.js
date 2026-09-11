import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://localhost:7059/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.startsWith("/auth/")) {
      localStorage.removeItem("token");
      localStorage.removeItem("belnova_user");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default api;
