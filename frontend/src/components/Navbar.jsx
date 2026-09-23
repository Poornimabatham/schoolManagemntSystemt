import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "?";
  const role = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "";

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-title">Dashboard</div>
      <div className="navbar-right">
        <div className="navbar-info">
          <span className="navbar-name">{user?.name || "User"}</span>
          <span className="navbar-role">{role}</span>
        </div>

        <div className="navbar-profile" ref={dropdownRef}>
          <div
            className="navbar-avatar"
            title={user?.name}
            onClick={() => setOpen((o) => !o)}
          >
            {avatarLetter}
          </div>

          {open && (
            <div className="navbar-dropdown">
              <div className="dropdown-user">
                <span className="dropdown-name">{user?.name}</span>
                <span className="dropdown-role">{role}</span>
              </div>
              <hr className="dropdown-divider" />
              <button className="dropdown-logout" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
