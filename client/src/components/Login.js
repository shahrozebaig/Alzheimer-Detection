import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      alert("✅ Login successful!");
      navigate("/prediction");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="auth-container dark">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-button">Login</button>
        </form>
        <div className="auth-links">
          <button onClick={() => navigate("/signup")}>Sign Up</button>
          <button onClick={() => navigate("/forgot-password")}>Forgot Password?</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
