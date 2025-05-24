import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.msg || "🎉 Password reset successful!");
      localStorage.removeItem("resetEmail");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "❌ Failed to reset password.");
    }
  };

  return (
    <div className="auth-container dark">
      <div className="auth-box">
        <h2>Reset Password</h2>
        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Reset Password</button>
        </form>

        <div className="auth-links">
          <button onClick={() => navigate("/login")}>Back to Login</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
