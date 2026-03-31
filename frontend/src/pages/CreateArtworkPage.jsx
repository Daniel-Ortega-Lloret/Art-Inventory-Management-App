import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtworkForm from "../components/ArtworkForm";
import api from "../api/axios";

export default function CreateArtworkPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(values) {
    try {
      setSubmitting(true);
      setError("");
      await api.post("/artworks", values);
      navigate("/artworks");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create artwork");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Add Artwork</h1>
        {error && <p className="error-text">{error}</p>}
        <ArtworkForm onSubmit={handleCreate} submitting={submitting} />
      </div>
    </div>
  );
}