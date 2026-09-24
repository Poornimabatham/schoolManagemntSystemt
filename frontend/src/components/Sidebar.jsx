// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard" },
  { icon: "🎓", label: "Students", path: "/students" },
  { icon: "👨‍🏫", label: "Teachers", path: "/teachers" },
  { icon: "📚", label: "Classes", path: "/classes" },
  { icon: "📝", label: "Attendance", path: "/attendance" },
  { icon: "💰", label: "Fees", path: "/fees" },
  { icon: "📋", label: "Exams", path: "/exams" },
  { icon: "📢", label: "Notice", path: "/notice" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🏫 SchoolMS</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}