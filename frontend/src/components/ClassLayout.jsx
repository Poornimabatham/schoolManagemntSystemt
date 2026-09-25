
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import api from "../api/axios";
import "../styles/StudentLayout.css";
import { useDebounce } from "../hooks/useDebounce";

export default function ClassLayout() {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch classes
  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/classes");

      if (
        response?.data &&
        Array.isArray(response.data.data)
      ) {
        setClasses(response.data.data);
      } else if (Array.isArray(response?.data)) {
        setClasses(response.data);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error("Failed to fetch classes:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load classes."
      );

      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial API call
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Safe array
  const safeClasses = useMemo(() => {
    return Array.isArray(classes) ? classes : [];
  }, [classes]);

  // Filter classes
  const filteredClasses = useMemo(() => {
    const term = (debouncedSearchTerm || "")
      .toLowerCase()
      .trim();

    if (!term) {
      return safeClasses;
    }

    return safeClasses.filter((item) => {
      const name = String(item?.name || "").toLowerCase();
      const grade = String(item?.grade || "").toLowerCase();
      const section = String(item?.section || "").toLowerCase();

      return (
        name.includes(term) ||
        grade.includes(term) ||
        section.includes(term)
      );
    });
  }, [safeClasses, debouncedSearchTerm]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return (
    <div className="student-container">

      {/* Header */}
      <div className="student-header">
        <div>
          <h2>Class Management</h2>

          <p className="student-subtitle">
            Manage, filter, and view all registered classes
          </p>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="filter-bar">

        {/* Search */}
        <div className="search-input-wrapper">
          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            className="search-input"
            placeholder="Search by class name, grade, or section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Clear Button */}
        {searchTerm && (
          <button
            className="icon-btn"
            onClick={handleClearSearch}
            title="Clear Search"
          >
            🔄 Clear
          </button>
        )}

      </div>

      {/* ================= TABLE ================= */}
      <div className="table-card">

        <div className="table-scroll-container">

          <table className="student-table">

            <thead>
              <tr>
                <th>Class ID</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Section</th>
              </tr>
            </thead>

            <tbody>

              {/* Loading */}
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="no-data"
                  >
                    Loading classes...
                  </td>
                </tr>
              ) : error ? (

                /* Error */
                <tr>
                  <td
                    colSpan="4"
                    className="no-data text-danger"
                  >
                    {error}
                  </td>
                </tr>

              ) : filteredClasses.length > 0 ? (

                /* Classes */
                filteredClasses.map((item) => {

                  const classId =
                    item?._id || item?.id || "N/A";

                  return (
                    <tr key={classId}>

                      <td className="font-semibold text-primary">
                        {classId}
                      </td>

                      <td>
                        {item?.name || "N/A"}
                      </td>

                      <td>
                        {item?.grade || "N/A"}
                      </td>

                      <td>
                        {item?.section || "N/A"}
                      </td>

                    </tr>
                  );
                })

              ) : (

                /* No classes */
                <tr>
                  <td
                    colSpan="4"
                    className="no-data"
                  >
                    No classes found matching your criteria.
                  </td>
                </tr>
              )}

            </tbody>
          </table>

        </div>

        {/* Footer */}
        <div className="table-footer">
          <span>
            Showing{" "}
            <strong>
              {filteredClasses.length}
            </strong>{" "}
            of{" "}
            <strong>
              {safeClasses.length}
            </strong>{" "}
            classes
          </span>
        </div>

      </div>
    </div>
  );
}

