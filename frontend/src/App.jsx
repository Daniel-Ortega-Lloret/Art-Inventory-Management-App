import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ArtworksPage from "./pages/ArtworksPage";
import CreateArtworkPage from "./pages/CreateArtworkPage";
import EditArtworkPage from "./pages/EditArtworkPage";
import ViewArtworkPage from "./pages/ViewArtworkPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={<Navigate to="/artworks" replace />}
          />

          <Route
            path="/artworks"
            element={
              <ProtectedRoute>
                <ArtworksPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/artworks/new"
            element={
              <ProtectedRoute>
                <CreateArtworkPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/artworks/:id"
            element={
              <ProtectedRoute>
                <ViewArtworkPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/artworks/:id/edit"
            element={
              <ProtectedRoute>
                <EditArtworkPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}