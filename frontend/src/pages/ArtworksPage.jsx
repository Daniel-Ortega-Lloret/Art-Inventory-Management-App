import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchArtworks(currentPage = 1) {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/artworks?page=${currentPage}&limit=10`);

      setArtworks(response.data.data);
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load artworks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArtworks(page);
  }, [page]);

  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this artwork?");
    if (!confirmed) return;

    try {
      await api.delete(`/artworks/${id}`);
      fetchArtworks(page);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete artwork");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Artwork Inventory</h1>
        <Link to="/artworks/new" className="button-link">Add Artwork</Link>
      </div>

      {loading && <p>Loading artworks...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Department</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {artworks.map((artwork) => (
                  <tr key={artwork._id}>
                    <td>{artwork.title}</td>
                    <td>{artwork.artist}</td>
                    <td>{artwork.department || "-"}</td>
                    <td>€{artwork.price}</td>
                    <td>{artwork.quantity}</td>
                    <td>{artwork.location}</td>
                    <td className="actions-cell">
                    <Link to={`/artworks/${artwork._id}/edit`}>Edit</Link>
                    <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleDelete(artwork._id)}
                    >
                        Delete
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}