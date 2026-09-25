import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import "../styles/AddStudentModal.css";

const DEFAULT_FORM_DATA = {
  name: "",
  email: "",
  classId: "",
  rollNo: "",
  gender: "Male",
  parentName: "",
  phone: "",
  status: "Active",
  joinDate: new Date().toISOString().split("T")[0],
};

export default function AddStudent({
  isOpen,
  onClose,
  classes = [],
  initialData = null,
  onStudentAdded,
}) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    setError("");
  }, []);

  useEffect(() => {
    if (initialData && isOpen) {
      const extractedClassId =
        typeof initialData.classId === "object"
          ? initialData.classId?._id || initialData.classId?.id || ""
          : initialData.classId || "";

      let formattedJoinDate = new Date().toISOString().split("T")[0];
      if (initialData.joinDate) {
        formattedJoinDate = new Date(initialData.joinDate)
          .toISOString()
          .split("T")[0];
      }

      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        classId: extractedClassId,
        rollNo: initialData.rollNo || "",
        gender: initialData.gender || "Male",
        parentName: initialData.parentName || "",
        phone: initialData.phone || "",
        status: initialData.status || "Active",
        joinDate: formattedJoinDate,
      });
    } else if (!isOpen) {
      resetForm();
    }
  }, [initialData, isOpen, resetForm]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const studentDbId = initialData?._id || initialData?.id;

      const response = studentDbId
        ? await api.put(`/student/${studentDbId}`, formData)
        : await api.post("/student", formData);

      if (
        response.data?.success ||
        response.status === 200 ||
        response.status === 201
      ) {
        onStudentAdded();
        resetForm();
        onClose();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save student data"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{initialData ? "Edit Student" : "Add New Student"}</h2>
          <button className="close-btn" onClick={onClose} type="button">
            &times;
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Student Name */}
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Aaravi Sharma"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="aarti.sharma@school.edu"
                required
              />
            </div>

            {/* Class Selection */}
            <div className="form-group">
              <label>Class *</label>
              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => {
                  const clsId = cls._id || cls.id;
                  return (
                    <option key={clsId} value={clsId}>
                      {cls.name || `Class ${cls.grade}-${cls.section}`}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Roll No */}
            <div className="form-group">
              <label>Roll Number *</label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="1001"
                required
              />
            </div>

            {/* Gender Dropdown */}
            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Parent Name */}
            <div className="form-group">
              <label>Parent Name *</label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                placeholder="Rajesh Sharma"
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            {/* Status Dropdown */}
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Join Date */}
            <div className="form-group">
              <label>Join Date</label>
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? "Saving..."
                : initialData
                ? "Update Student"
                : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}