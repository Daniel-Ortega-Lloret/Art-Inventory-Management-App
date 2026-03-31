import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const searchOptions = [
  { value: "", label: "All Fields" },
  { value: "title", label: "Title" },
  { value: "artist", label: "Artist" },
  { value: "department", label: "Department" }
];

const sortableColumns = [
  { key: "title", label: "Title" },
  { key: "artist", label: "Artist" },
  { key: "department", label: "Department" },
  { key: "classification", label: "Classification" }
];

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchField, setSearchField] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedSearchField, setAppliedSearchField] = useState("");

  const [sortConfig, setSortConfig] = useState({
    title: "-",
    artist: "-",
    department: "-",
    classification: "-"
  });

  function buildSortParam(config) {
    return Object.entries(config)
      .filter(([, value]) => value === "asc" || value === "desc")
      .map(([key, value]) => `${key}:${value}`)
      .join(",");
  }

  async function fetchArtworks(
    currentPage = 1,
    currentSearch = "",
    currentField = "",
    currentSortConfig = sortConfig
  ) {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "10"
      });

      if (currentSearch.trim()) {
        params.set("search", currentSearch.trim());
      }

      if (currentField) {
        params.set("searchField", currentField);
      }

      const sortParam = buildSortParam(currentSortConfig);
      if (sortParam) {
        params.set("sort", sortParam);
      }

      const response = await api.get(`/artworks?${params.toString()}`);

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
    fetchArtworks(page, appliedSearch, appliedSearchField, sortConfig);
  }, [page, appliedSearch, appliedSearchField, sortConfig]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(searchInput);
    setAppliedSearchField(searchField);
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearchField("");
    setAppliedSearch("");
    setAppliedSearchField("");
    setPage(1);
  }

  function cycleSortState(columnKey) {
    setPage(1);
    setSortConfig((prev) => {
      const current = prev[columnKey];
      let next = "-";

      if (current === "-") next = "asc";
      else if (current === "asc") next = "desc";
      else if (current === "desc") next = "-";

      return {
        ...prev,
        [columnKey]: next
      };
    });
  }

  function getSortIndicator(columnKey) {
    const value = sortConfig[columnKey];
    if (value === "asc") return "↑";
    if (value === "desc") return "↓";
    return "-";
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this artwork?");
    if (!confirmed) return;

    try {
      await api.delete(`/artworks/${id}`);
      fetchArtworks(page, appliedSearch, appliedSearchField, sortConfig);
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

      <div className="card search-card">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <select
            value={searchField}
            onChange={(event) => setSearchField(event.target.value)}
            className="search-select"
          >
            {searchOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder={
              searchField
                ? `Search by ${searchOptions.find((o) => o.value === searchField)?.label}...`
                : "Search all fields..."
            }
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="search-input"
          />

          <button type="submit">Search</button>
          <button type="button" className="secondary-button" onClick={handleClearSearch}>
            Clear
          </button>
        </form>

        <p className="search-help-text">
          {appliedSearchField
            ? `Searching ${searchOptions.find((o) => o.value === appliedSearchField)?.label} for values starting with "${appliedSearch}".`
            : appliedSearch
              ? `Searching all fields for "${appliedSearch}".`
              : "Choose Title, Artist, or Department to search by prefix, or leave it on All Fields."}
        </p>
      </div>

      {loading && <p>Loading artworks...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {sortableColumns.map((column) => (
                    <th key={column.key}>
                      <div className="sortable-header">
                        <span>{column.label}</span>
                        <button
                          type="button"
                          className="sort-button"
                          onClick={() => cycleSortState(column.key)}
                          title={`Toggle sort for ${column.label}`}
                        >
                          {getSortIndicator(column.key)}
                        </button>
                      </div>
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {artworks.length > 0 ? (
                  artworks.map((artwork) => (
                    <tr key={artwork._id}>
                      <td>{artwork.title || "-"}</td>
                      <td>{artwork.artist || "-"}</td>
                      <td>{artwork.department || "-"}</td>
                      <td>{artwork.classification || "-"}</td>
                      <td className="actions-cell">
                        <Link to={`/artworks/${artwork._id}`}>View</Link>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No artworks found.</td>
                  </tr>
                )}
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
              Page {page} of {totalPages || 1}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages || 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}