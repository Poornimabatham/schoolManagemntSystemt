import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user } = useAuth();

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "?";
  const role = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "";

  return (
    <header className="navbar">
      <div className="navbar-title">Dashboard</div>
      <div className="navbar-right">
        <div className="navbar-info">
          <span className="navbar-name">{user?.name || "User"}</span>
          <span className="navbar-role">{role}</span>
        </div>
        <div className="navbar-avatar" title={user?.name}>
          {avatarLetter}
        </div>
      </div>
    </header>
  );
}
