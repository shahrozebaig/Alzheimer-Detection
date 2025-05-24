import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.msg || "📧 OTP sent to your email.");
      localStorage.setItem("resetEmail", email); // Save email to pass to next page
      setTimeout(() => navigate("/reset-password"), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "❌ Failed to send OTP.");
    }
  };

  return (
    <div className="auth-container dark">
      <div className="auth-box">
        <h2>Forgot Password</h2>
        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Send OTP</button>
        </form>

        <div className="auth-links">
          <button onClick={() => navigate("/login")}>Back to Login</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
