import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

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
        <Link to="/" className="brand">Art Inventory</Link>
        {user && (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/artworks">Artworks</Link>
            <Link to="/artworks/new">Add Artwork</Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="user-badge">
              {user.name}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}