import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function AuthPage({ mode, setUser }) {
  const navigate = useNavigate();
  const register = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const endpoint = `/auth/${register ? "register" : "login"}`;
      const payload = register
        ? form
        : { email: form.email, password: form.password };

      const { data } = await api.post(endpoint, payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please check credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="u-container" style={{ maxWidth: 520, paddingTop: 20 }}>
      <div className="u-form-card">
        <div className="u-form-head">
          <div className="brand-icon-box" style={{ width: 44, height: 44, margin: "0 auto 12px" }}>
            <Icon name="plane" size={24} />
          </div>
          <h2>{register ? "Create Account" : "Welcome Back"}</h2>
          <p>{register ? "Join TravelEase to plan trips and book stays" : "Sign in to manage your bookings and custom itineraries"}</p>
        </div>

        {error && (
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "#fee2e2", color: "#991b1b", marginBottom: 18, fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {register && (
            <div className="u-form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                className="u-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}

          <div className="u-form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              className="u-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="u-form-group">
            <label>Password</label>
            <input
              type="password"
              required
              minLength={register ? 8 : undefined}
              className="u-input"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="u-btn u-btn-primary"
            style={{ width: "100%", padding: 13, marginTop: 10, fontSize: "1rem" }}
          >
            {submitting ? "Processing..." : register ? "Register Account" : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 22, fontSize: "0.9rem", color: "#64748b" }}>
          {register ? (
            <span>
              Already registered? <Link to="/login" style={{ color: "var(--u-primary)", fontWeight: 700 }}>Log in</Link>
            </span>
          ) : (
            <span>
              Don't have an account? <Link to="/register" style={{ color: "var(--u-primary)", fontWeight: 700 }}>Register here</Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
