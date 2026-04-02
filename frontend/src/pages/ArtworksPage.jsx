/**
 * Main inventory page for browsing artworks
 * This page:
 * - Fetches paginated artwork data from the backend
 * - Supports search by selected field
 * - Supports multi-column sorting
 * - Preserves page/search/sort state in the URL
 * - Preserves scroll position during pagination and sorting
 * - Allows users to view, edit, and delete artworks
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

// Search dropdown options shown above the inventory table
const searchOptions = [
  { value: "", label: "All Fields" },
  { value: "title", label: "Title" },
  { value: "artist", label: "Artist" },
  { value: "department", label: "Department" }
];

// Table columns that can be sorted by the user
const sortableColumns = [
  { key: "title", label: "Title" },
  { key: "artist", label: "Artist" },
  { key: "department", label: "Department" },
  { key: "classification", label: "Classification" }
];

// Default sort state for each sortable column
// "-" means no sorting is applied for that column
const defaultSortConfig = {
  title: "-",
  artist: "-",
  department: "-",
  classification: "-"
};

// Convert the sort query string from the URL into the frontend sort state object
function parseSortParam(sortParam) {
  const nextConfig = { ...defaultSortConfig };

  if (!sortParam) {
    return nextConfig;
  }

  const parts = sortParam.split(",");

  for (const part of parts) {
    const [field, direction] = part.split(":");

    if (
      Object.prototype.hasOwnProperty.call(nextConfig, field) &&
      (direction === "asc" || direction === "desc")
    ) {
      nextConfig[field] = direction;
    }
  }

  return nextConfig;
}

export default function ArtworksPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read the initial page, search, and sort values from the URL
  const initialPage = Math.max(1, Number(searchParams.get("page") || "1"));
  const initialSearch = searchParams.get("search") || "";
  const initialSearchField = searchParams.get("searchField") || "";
  const initialSort = parseSortParam(searchParams.get("sort") || "");

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const [searchField, setSearchField] = useState(initialSearchField);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch);
  const [appliedSearchField, setAppliedSearchField] = useState(initialSearchField);

  const [sortConfig, setSortConfig] = useState(initialSort);
  const [pageInput, setPageInput] = useState(String(initialPage));

  // Store the scroll position so the page does not jump back to the top
  const scrollPositionRef = useRef(0);

  function rememberScrollPosition() {
    scrollPositionRef.current = window.scrollY;
  }

  function restoreScrollPosition() {
    window.scrollTo({
      top: scrollPositionRef.current,
      behavior: "auto"
    });
  }

  // Convert the local sort config into the backend sort query format
  function buildSortParam(config) {
    return Object.entries(config)
      .filter(([, value]) => value === "asc" || value === "desc")
      .map(([key, value]) => `${key}:${value}`)
      .join(",");
  }

  const sortParam = useMemo(() => buildSortParam(sortConfig), [sortConfig]);

  // Keep the URL in sync with the current page, search, and sort state
  useEffect(() => {
    const nextParams = {};

    if (page > 1) {
      nextParams.page = String(page);
    }

    if (appliedSearch.trim()) {
      nextParams.search = appliedSearch.trim();
    }

    if (appliedSearchField) {
      nextParams.searchField = appliedSearchField;
    }

    if (sortParam) {
      nextParams.sort = sortParam;
    }

    setSearchParams(nextParams, { replace: true });
  }, [page, appliedSearch, appliedSearchField, sortParam, setSearchParams]);

  // Fetch the current page of artworks from the backend
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

      const builtSortParam = buildSortParam(currentSortConfig);
      if (builtSortParam) {
        params.set("sort", builtSortParam);
      }

      const response = await api.get(`/artworks?${params.toString()}`);

      setArtworks(response.data.data);
      setPage(response.data.page);
      setPageInput(String(response.data.page));
      setTotalPages(response.data.totalPages);

      // Restore previous scroll position after the table rerenders
      requestAnimationFrame(() => {
        restoreScrollPosition();
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load artworks");
    } finally {
      setLoading(false);
    }
  }

  // Refetch whenever page, search, or sort changes
  useEffect(() => {
    fetchArtworks(page, appliedSearch, appliedSearchField, sortConfig);
  }, [page, appliedSearch, appliedSearchField, sortConfig]);

  // Apply the current search input and selected search field
  function handleSearchSubmit(event) {
    event.preventDefault();
    setAppliedSearch(searchInput);
    setAppliedSearchField(searchField);
  }

  // Reset search and sorting back to defaults
  function handleClearSearch() {
    setSearchInput("");
    setSearchField("");
    setAppliedSearch("");
    setAppliedSearchField("");
    setSortConfig({ ...defaultSortConfig });
  }

  // Cycle sort state for a column
  function cycleSortState(columnKey) {
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

  // Return the correct visual indicator for a column's sort state
  function getSortIndicator(columnKey) {
    const value = sortConfig[columnKey];
    if (value === "asc") return "↑";
    if (value === "desc") return "↓";
    return "-";
  }

  // Jump directly to a specific page number entered by the user
  function handlePageJump(event) {
    event.preventDefault();

    const numericPage = Number(pageInput);

    if (!Number.isInteger(numericPage) || numericPage < 1 || numericPage > totalPages) {
      setError(`Enter a page number between 1 and ${totalPages}.`);
      return;
    }

    setError("");
    rememberScrollPosition();
    setPage(numericPage);
  }

  // Delete an artwork after user confirmation, then refresh the table
  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this artwork?");
    if (!confirmed) return;

    try {
      rememberScrollPosition();
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
                          onClick={() => {
                            rememberScrollPosition();
                            cycleSortState(column.key);
                          }}
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
                        <Link
                          to={`/artworks/${artwork._id}?from=${encodeURIComponent(
                            `/artworks?${searchParams.toString()}`
                          )}`}
                        >
                          View
                        </Link>
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
              onClick={() => {
                rememberScrollPosition();
                setPage((prev) => Math.max(prev - 1, 1));
              }}
              disabled={page === 1}
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages || 1}
            </span>

            <button
              onClick={() => {
                rememberScrollPosition();
                setPage((prev) => Math.min(prev + 1, totalPages || 1));
              }}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>

          <form onSubmit={handlePageJump} className="page-jump-form">
            <label className="page-jump-label">
              Go to page
              <input
                type="number"
                min="1"
                max={Math.max(totalPages, 1)}
                value={pageInput}
                onChange={(event) => setPageInput(event.target.value)}
                className="page-jump-input"
              />
            </label>
            <button type="submit">Go</button>
          </form>
        </div>
      )}
    </div>
  );
}