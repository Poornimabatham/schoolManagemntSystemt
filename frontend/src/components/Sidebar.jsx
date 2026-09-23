import { useState } from "react";
import "../styles/Sidebar.css";

const navItems = [
  { icon: "🏠", label: "Dashboard" },
  { icon: "🎓", label: "Students" },
  { icon: "👨🏫", label: "Teachers" },
  { icon: "📚", label: "Classes" },
  { icon: "📝", label: "Attendance" },
  { icon: "💰", label: "Fees" },
  { icon: "📋", label: "Exams" },
  { icon: "📢", label: "Notice" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🏫 SchoolMS</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`sidebar-item ${active === item.label ? "active" : ""}`}
            onClick={() => setActive(item.label)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
