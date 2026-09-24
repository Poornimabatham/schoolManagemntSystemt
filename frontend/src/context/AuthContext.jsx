import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Auth state
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Filter states (Defaulting to "All" to prevent undefined checks)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Reset all search/filter controls
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedClass("All");
    setSelectedStatus("All");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        searchTerm,
        setSearchTerm,
        selectedClass,
        setSelectedClass,
        selectedStatus,
        setSelectedStatus,
        resetFilters,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);