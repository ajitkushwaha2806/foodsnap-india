import axios from "axios";

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

export const getSessionToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || null;
};

export const setSessionToken = (token) => {
  if (typeof window === "undefined" || !token) return;
  localStorage.setItem("token", token);
  document.cookie = `token=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
};

export const clearSessionToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
};

export const apiClient = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;