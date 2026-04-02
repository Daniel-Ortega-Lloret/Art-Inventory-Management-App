/**
 * Page for creating a new artwork entry
 * This page renders the reusable ArtworkForm component
 * and sends the submitted data to the backend API
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtworkForm from "../components/ArtworkForm";
import api from "../api/axios";

export default function CreateArtworkPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Submit the new artwork to the backend and redirect on success
  async function handleCreate(values) {
    try {
      setSubmitting(true);
      setError("");
      setFieldErrors({});

      await api.post("/artworks", values);
      navigate("/artworks");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create artwork");
      setFieldErrors(err.response?.data?.fieldErrors || {});
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Add Artwork</h1>
        <ArtworkForm
          onSubmit={handleCreate}
          submitting={submitting}
          serverFieldErrors={fieldErrors}
          formError={error}
        />
      </div>
    </div>
  );
}