/**
 * Registration page for new staff accounts
 * This page:
 * - Collects name, email, and password
 * - Performs client-side validation
 * - Calls the register function from AuthContext
 * - Redirects to the artworks page after successful registration
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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

  // Basic client-side validation before sending to the backend
  function validate() {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Name is required";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    return errors;
  }

  // Submit the registration request and redirect on success
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
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate("/artworks");
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <div className="card auth-card">
        <h1>Create Staff Account</h1>
        <p>Register a staff member to access the inventory system.</p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
          </label>

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
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}