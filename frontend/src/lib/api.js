import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const foodApi = {
  getAll: () => api.get("/api/food"),
  like: (foodId) => api.post("/api/food/like", { foodId }),
  save: (foodId) => api.post("/api/food/save", { foodId }),
  getSaved: () => api.get("/api/food/save"),
};
