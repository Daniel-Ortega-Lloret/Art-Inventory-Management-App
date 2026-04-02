/**
 * Artwork detail page
 * This page:
 * - Fetches one artwork by id from the backend
 * - Displays the artwork image and metadata
 * - Provides a link back to the previous artworks list state
 * - Falls back gracefully if the image cannot be loaded
 */

import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function ViewArtworkPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  // Preserve the previous artworks page state so the back link can restore it
  const from = searchParams.get("from") || "/artworks";

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  // Fetch the artwork details when the page loads or the id changes
  useEffect(() => {
    async function fetchArtwork() {
      try {
        setLoading(true);
        setError("");

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

  if (loading) {
    return (
      <div className="page">
        <p>Loading artwork...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="page">
        <p>No artwork found.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{artwork.title}</h1>
        <div className="details-actions">
          <Link to={`/artworks/${artwork._id}/edit`} className="button-link">
            Edit
          </Link>
          <Link to={from} className="button-link secondary-button">
            Back to Artworks
          </Link>
        </div>
      </div>

      <div className="artwork-detail-layout">
        <div className="card artwork-image-card">
          {artwork.imageURL && !imageFailed ? (
            <img
              src={artwork.imageURL}
              alt={artwork.title}
              className="artwork-detail-image"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="image-placeholder">
              No image available for this artwork.
            </div>
          )}
        </div>

        <div className="card artwork-info-card">
          <h2>Artwork Details</h2>

          <div className="detail-grid">
            <div><strong>Title:</strong> {artwork.title || "-"}</div>
            <div><strong>Artist:</strong> {artwork.artist || "-"}</div>
            <div><strong>Date:</strong> {artwork.date || "-"}</div>
            <div><strong>Medium:</strong> {artwork.medium || "-"}</div>
            <div><strong>Classification:</strong> {artwork.classification || "-"}</div>
            <div><strong>Department:</strong> {artwork.department || "-"}</div>
            <div><strong>Accession Number:</strong> {artwork.accessionNumber || "-"}</div>
            <div><strong>Nationality:</strong> {artwork.nationality || "-"}</div>
            <div><strong>Artist Bio:</strong> {artwork.artistBio || "-"}</div>
            <div><strong>Dimensions:</strong> {artwork.dimensions || "-"}</div>
            <div><strong>Height (cm):</strong> {artwork.heightCm ?? "-"}</div>
            <div><strong>Width (cm):</strong> {artwork.widthCm ?? "-"}</div>
            <div><strong>Credit Line:</strong> {artwork.creditLine || "-"}</div>
            <div><strong>On View:</strong> {artwork.onView || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}