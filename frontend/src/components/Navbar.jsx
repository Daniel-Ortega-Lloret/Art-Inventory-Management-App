import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const backendBaseUrl = "http://localhost:3000";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/artworks" className="brand">Art Inventory</Link>
        {user && (
          <>
            <Link to="/artworks">Artworks</Link>
            <Link to="/artworks/new">Add Artwork</Link>
            <a
              href={`${backendBaseUrl}/about`}
              target="_blank"
              rel="noreferrer"
              className="nav-button-link"
            >
              About this Page
            </a>
          </>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="user-badge">{user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}