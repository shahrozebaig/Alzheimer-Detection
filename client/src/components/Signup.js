import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Signup = ({ darkMode }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("✅ Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed. Please try again.");
    }
  };

  return (
    <div className={`auth-container ${darkMode ? "dark" : ""}`}>
      <div className="auth-box">
        <h2>Sign Up</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <div className="auth-links">
          <button onClick={() => navigate("/login")}>Back to Login</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
