/**
 * Login page for staff users
 * This page:
 * - Collects email and password
 * - Performs basic client-side validation
 * - Calls the login function from AuthContext
 * - Redirects to the artworks page on success
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Update form state and clear any field-level error as the user types
  function handleChange(event) {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [event.target.name]: ""
    }));
  }

  // Basic client-side validation before submitting
  function validate() {
    const errors = {};

    if (!form.email.trim()) {
      errors.email = "Email is required";
    }

    if (!form.password) {
      errors.password = "Password is required";
    }

    return errors;
  }

  // Submit the login request and redirect on success
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await login(form.email.trim(), form.password);
      navigate("/artworks");
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <div className="card auth-card">
        <h1>Staff Login</h1>
        <p>Sign in to manage museum inventory.</p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Need an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}