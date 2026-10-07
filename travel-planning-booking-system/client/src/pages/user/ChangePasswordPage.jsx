import React, { useState } from "react";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function ChangePasswordPage({ admin = false }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const { data } = await api.put("/auth/change-password", form);
      setSuccess(data.message);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update your password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={`password-page ${admin ? "admin-password-page" : "u-container"}`}>
      <div className={admin ? "adm-header-row" : "u-section-head"}>
        <div>
          <h1>Change Password</h1>
          <p>Update the password you use to sign in to your account.</p>
        </div>
      </div>

      <div className="password-card">
        <div className="password-intro">
          <div className="password-icon">
            <Icon name="shield" size={21} />
          </div>
          <div>
            <h2>Account security</h2>
            <p>Enter your current password, then choose a new one.</p>
          </div>
        </div>

        {error && <div className="password-message error" role="alert">{error}</div>}
        {success && <div className="password-message success" role="status">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="password-form-group">
            <label htmlFor="current-password">Current password</label>
            <input
              id="current-password"
              className="password-input"
              type="password"
              autoComplete="current-password"
              required
              maxLength={128}
              value={form.currentPassword}
              onChange={(event) => setForm({ ...form, currentPassword: event.target.value })}
            />
          </div>

          <div className="password-form-group">
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              className="password-input"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={form.newPassword}
              onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
            />
            <small className="password-hint">Use at least 8 characters.</small>
          </div>

          <div className="password-form-group">
            <label htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password"
              className="password-input"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            />
          </div>

          <button className={`password-submit ${admin ? "adm-btn adm-btn-primary" : "u-btn u-btn-primary"}`} type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </section>
  );
}
