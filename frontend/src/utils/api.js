import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach Authorization Bearer token if available in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("campusta_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 Unauthorized responses (token expired / invalidated)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user if unauthenticated
      localStorage.removeItem("campusta_token");
      localStorage.removeItem("campusta_user");
    }
    return Promise.reject(error);
  }
);

export default api;
