import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";

export default function StatusDropdown({ studentId, currentStatus, onStatusUpdated }) {
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
}