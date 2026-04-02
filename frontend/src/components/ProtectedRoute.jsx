/**
 * Route guard component for protected pages
 * If authentication is still loading, it shows a loading message
 * If the user is not logged in, it redirects to the login page
 * Otherwise, it renders the protected child content
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Prevent redirecting before auth state has been checked
  if (loading) {
    return <div className="page"><p>Loading...</p></div>;
  }

  // Redirect unauthenticated users to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}