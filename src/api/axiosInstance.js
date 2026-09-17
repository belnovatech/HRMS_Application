import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_API_URL ||
    "https://belnova-hrms-api.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

const isAuthEndpoint = (url = "") => {
  const lower = String(url).toLowerCase();
  return (
    lower.includes("/auth/login") ||
    lower.includes("/auth/request-otp") ||
    lower.includes("/auth/verify-otp") ||
    lower.includes("/auth/reset-password")
  );
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !isAuthEndpoint(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (isAuthEndpoint(config.url)) {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuth = isAuthEndpoint(err.config?.url);
    if (err.response?.status === 401 && !isAuth) {
      localStorage.removeItem("token");
      localStorage.removeItem("belnova_user");
      if (window.location.hash !== "#/login" && window.location.pathname !== "/login") {
        window.location.href = "/#/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
