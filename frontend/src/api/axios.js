/**
 * Shared Axios instance for frontend API requests
 * This file:
 * - Sets the backend API base URL from the Vite environment
 * - Automatically attaches the JWT token to outgoing requests
 * - Provides a single reusable HTTP client across the app
 */

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Add the JWT token to every request if the user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;