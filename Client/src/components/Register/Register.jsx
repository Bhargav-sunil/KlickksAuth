import React, { useState } from "react";
import "./Register.css";

const Register = ({ setCurrentView }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    if (!email) return { isValid: false, message: "Email is required" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Invalid email format" };
    }

    const domain = email.split("@")[1].toLowerCase();
    const allowedDomains = ["gmail.com", "googlemail.com"];

    if (!allowedDomains.includes(domain)) {
      return {
        isValid: false,
        message: "Only Gmail addresses are allowed",
      };
    }

    return { isValid: true, message: "" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate email in real-time
    if (name === "email") {
      const validation = validateEmail(value);
      setEmailError(validation.isValid ? "" : validation.message);
    }

    // Clear errors when typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final email validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.message);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://klickksauth.onrender.com/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created successfully! Please login.");
        setError("");
        setTimeout(() => setCurrentView("login"), 2000);
      } else {
        setError(data.error);
        setSuccess("");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Sign up with your Gmail address</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Gmail address"
              value={formData.email}
              onChange={handleChange}
              required
              className={emailError ? "input-error" : ""}
            />
            {emailError && <div className="field-error">{emailError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <div className="password-requirements">Minimum 6 characters</div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={!!emailError || isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <span className="auth-link" onClick={() => setCurrentView("login")}>
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
