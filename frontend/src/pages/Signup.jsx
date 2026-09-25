import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../api/auth";
import "../styles/Signup.css";

const ROLES = ["admin", "teacher", "student", "parent"];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRoleSelect = (roleValue) => {
    setForm((prev) => ({ ...prev, role: roleValue }));
  };

  const prefetchLogin = () => {
    import("./Login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) {
      setError("Please select a role");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signupUser(form);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Side: Branding Banner */}
        <div className="auth-banner">
          <div className="banner-content">
            <div className="banner-badge">🏫 SchoolMS</div>
            <h1>Join Our Academic Community</h1>
            <p>
              Create an account to manage classes, track academic performance, and stay connected.
            </p>
          </div>
          <div className="banner-footer">
            <span>© 2026 SchoolMS. All rights reserved.</span>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Create account</h2>
            <p className="auth-subtitle">Fill in the details below to get started</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@school.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* 2-per-row Role Selector Grid */}
            <div className="form-group">
              <label>Select Role</label>
              <div className="role-grid">
                {ROLES.map((r) => (
                  <button
                    type="button"
                    key={r}
                    className={`role-card ${form.role === r ? "active" : ""}`}
                    onClick={() => handleRoleSelect(r)}
                  >
                    <span className="role-radio"></span>
                    <span className="role-text">
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
              onMouseEnter={prefetchLogin}
              onFocus={prefetchLogin}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span> Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}