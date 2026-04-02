/**
 * Authentication context for the frontend
 * This file:
 * - Stores the current user and loading state
 * - Restores the user session from a saved JWT token
 * - Exposes login, register, and logout functions
 * - Makes authentication state available throughout the app
 */

import { createContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether a stored JWT token is still valid
  // and fetch the current user's details from the backend
  async function fetchMe() {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch {
      // Remove invalid or expired tokens from storage
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Run once when the app loads to restore authentication state
  useEffect(() => {
    fetchMe();
  }, []);

  // Log a user in and store the returned JWT token
  async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    return response.data.user;
  }

  // Register a new user and immediately store their JWT token
  async function register(name, email, password) {
    const response = await api.post("/auth/register", {
      name,
      email,
      password
    });

    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    return response.data.user;
  }

  // Remove the saved token and clear the current user
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  // Memoize context value to avoid unnecessary rerenders
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}