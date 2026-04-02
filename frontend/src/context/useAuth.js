/**
 * Custom hook for accessing authentication context
 * This provides a cleaner way to use AuthContext inside components
 */

import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  // Ensure this hook is only used inside the AuthProvider tree
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}