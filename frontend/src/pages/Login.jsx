import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import "../styles/Login.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const prefetchDashboard = () => {
    import("../pages/Dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Login failed"
      );
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
            <h1>Smart School Management Made Simple</h1>
            <p>
              Streamline classes, attendance, grades, and communications all in one secure platform.
            </p>
          </div>
          <div className="banner-footer">
            <span>© 2026 SchoolMS. All rights reserved.</span>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Please enter your details to sign in</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
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
                  placeholder="name@school.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="username"
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
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
              onMouseEnter={prefetchDashboard}
              onFocus={prefetchDashboard}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span> Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}