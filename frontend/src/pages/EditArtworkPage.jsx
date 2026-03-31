import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArtworkForm from "../components/ArtworkForm";
import api from "../api/axios";

export default function EditArtworkPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchArtwork() {
      try {
        const response = await api.get(`/artworks/${id}`);
        setArtwork(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load artwork");
      } finally {
        setLoading(false);
      }
    }

    fetchArtwork();
  }, [id]);

  async function handleUpdate(values) {
    try {
      setSubmitting(true);
      setError("");
      await api.put(`/artworks/${id}`, values);
      navigate("/artworks");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update artwork");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="page"><p>Loading artwork...</p></div>;
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Edit Artwork</h1>
        {error && <p className="error-text">{error}</p>}
        {artwork && (
          <ArtworkForm
            initialValues={artwork}
            onSubmit={handleUpdate}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}