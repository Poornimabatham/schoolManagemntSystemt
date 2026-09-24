import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "../styles/StudentLayout.css";
import { useDebounce } from "../hooks/useDebounce";
import AddStudent from "./AddStudent";

// Custom status menu dropdown component
const StatusDropdown = ({ studentId, currentStatus, onStatusUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef(null);

  const statuses = ["Active", "Inactive", "Pending"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusSelect = async (newStatus) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    try {
      setIsUpdating(true);
      await api.patch(`/student/${studentId}/status`, { status: newStatus });
      onStatusUpdated(studentId, newStatus);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="status-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`status-badge status-${currentStatus?.toLowerCase()} ${
          isUpdating ? "updating" : ""
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isUpdating}
      >
        {isUpdating ? "Updating..." : `${currentStatus} ▾`}
      </button>

      {isOpen && (
        <div className="status-menu">
          {statuses.map((status) => (
            <div
              key={status}
              className={`status-option status-option-${status.toLowerCase()} ${
                status === currentStatus ? "active-selection" : ""
              }`}
              onClick={() => handleStatusSelect(status)}
            >
              <span className={`status-dot dot-${status.toLowerCase()}`}></span>
              {status}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function StudentLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // Holds student being edited
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    searchTerm,
    setSearchTerm,
    selectedClass,
    setSelectedClass,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = useAuth();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [studentsRes, classesRes] = await Promise.all([
        api.get("/student"),
        api.get("/classes"),
      ]);

      setStudents(studentsRes.data.data || []);
      setClasses(classesRes.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update status locally for snappy UX
  const handleStatusUpdatedLocally = (studentId, newStatus) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s._id === studentId || s.id === studentId || s.studentId === studentId
          ? { ...s, status: newStatus }
          : s
      )
    );
  };

  // 1. DELETE API CALL
  const handleDelete = async (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${name || "this student"}?`
    );
    if (!isConfirmed) return;

    try {
      await api.delete(`/student/${id}`);
      // Remove deleted item locally without full re-fetch
      setStudents((prev) => prev.filter((student) => (student._id || student.id) !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete student");
    }
  };

  // 2. OPEN MODAL FOR EDIT
  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  // 3. OPEN MODAL FOR CREATE
  const handleAddNew = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students)) return [];

    const search = (debouncedSearchTerm || "").toLowerCase().trim();
    const currentClass = selectedClass || "All";
    const currentStatus = selectedStatus || "All";

    return students.filter((student) => {
      const name = (student?.name || "").toLowerCase();
      const id = String(
        student?.studentId || student?.id || student?._id || ""
      ).toLowerCase();
      const email = (student?.email || "").toLowerCase();

      const studentClassId =
        typeof student?.classId === "object"
          ? student?.classId?._id || ""
          : student?.classId || "";

      const status = student?.status || "";

      const matchesSearch =
        !search ||
        name.includes(search) ||
        id.includes(search) ||
        email.includes(search);

      const matchesClass =
        currentClass === "All" || studentClassId === currentClass;

      const matchesStatus =
        currentStatus === "All" || status === currentStatus;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [students, debouncedSearchTerm, selectedClass, selectedStatus]);

  return (
    <div className="student-container">
      {/* Header */}
      <div className="student-header">
        <div>
          <p className="student-subtitle">
            Manage, filter, and view all registered students
          </p>
        </div>

        <button className="add-student-btn" onClick={handleAddNew}>
          + Add New Student
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, ID, or email..."
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Class:</label>
          <select
            className="filter-select"
            value={selectedClass || "All"}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="All">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id || cls.name} value={cls._id || cls.name}>
                {cls.name || `Class ${cls.grade}-${cls.section}`}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Status:</label>
          <select
            className="filter-select"
            value={selectedStatus || "All"}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <button
          className="icon-btn"
          onClick={resetFilters}
          title="Reset Filters"
        >
          🔄 Clear
        </button>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-scroll-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name & Email</th>
                <th>Class</th>
                <th>Roll No</th>
                <th>Parent Name</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    Loading students data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="no-data text-danger">
                    {error}
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const studentDbId = student?._id || student?.id;
                  const studentId = student?.studentId || studentDbId || "N/A";
                  const classDisplay =
                    typeof student?.classId === "object"
                      ? student?.classId?.name || "N/A"
                      : student?.grade || "N/A";
                  const status = student?.status || "Active";

                  return (
                    <tr key={studentDbId || studentId}>
                      <td className="font-semibold text-primary">
                        {studentId}
                      </td>

                      <td>
                        <div className="student-info">
                          <span className="student-name">
                            {student?.name || "Unnamed"}
                          </span>
                          <span className="student-email">
                            {student?.email || "No email"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="grade-badge">{classDisplay}</span>
                      </td>

                      <td>{student?.rollNo || "-"}</td>
                      <td>{student?.parentName || "-"}</td>
                      <td>{student?.phone || "-"}</td>

                      <td>
                        <StatusDropdown
                          studentId={studentDbId}
                          currentStatus={status}
                          onStatusUpdated={handleStatusUpdatedLocally}
                        />
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="icon-btn edit-btn"
                            title="Edit"
                            onClick={() => handleEdit(student)}
                          >
                            ✏️
                          </button>
                          <button
                            className="icon-btn delete-btn"
                            title="Delete"
                            onClick={() =>
                              handleDelete(studentDbId, student.name)
                            }
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Showing <strong>{filteredStudents.length}</strong> of{" "}
            <strong>{students.length}</strong> students
          </span>
        </div>
      </div>

      {/* Modal supporting both Add & Edit modes */}
      <AddStudent
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        classes={classes}
        initialData={editingStudent}
        onStudentAdded={fetchData}
      />
    </div>
  );
}