// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { 
    icon: "🏠", 
    label: "Dashboard", 
    path: "/dashboard", 
    allowedRoles: ["admin", "teacher", "parent", "student"] 
  },
  { 
    icon: "👤", 
    label: "My Profile", 
    path: "/profile", 
    allowedRoles: ["student", "parent", "teacher"] 
  },
  { 
    icon: "🎓", 
    label: "Students", 
    path: "/students", 
    allowedRoles: ["admin", "teacher"] 
  },
  { 
    icon: "👨‍🏫", 
    label: "Teachers", 
    path: "/teachers", 
    allowedRoles: ["admin"] 
  },
  { 
    icon: "📚", 
    label: "Classes", 
    path: "/classes", 
    allowedRoles: ["admin", "teacher"] 
  },
  { 
    icon: "📝", 
    label: "Attendance", 
    path: "/attendance", 
    allowedRoles: ["admin", "teacher", "student", "parent"] 
  },
  { 
    icon: "💰", 
    label: "Fees", 
    path: "/fees", 
    allowedRoles: ["admin", "parent", "student"] 
  },
  { 
    icon: "📋", 
    label: "Exams", 
    path: "/exams", 
    allowedRoles: ["admin", "teacher", "student", "parent"] 
  },
  { 
    icon: "📢", 
    label: "Notice", 
    path: "/notice", 
    allowedRoles: ["admin", "teacher", "parent", "student"] 
  },
];

export default function Sidebar() {
  const { user } = useAuth();

  // Normalize role to lowercase to match allowedRoles array safely
  const userRole = user?.role?.toLowerCase() || "";

  // Filter menu items matching the user's role
  const visibleNavItems = navItems.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🏫 SchoolMS</div>


      <nav className="sidebar-nav">
        {visibleNavItems.map((item) => (
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