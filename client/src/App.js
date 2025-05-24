import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PredictionForm from "./components/PredictionForm";
import ResultsPage from "./components/ResultsPage";
import "./components/Auth.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className={`app-wrapper ${darkMode ? "dark" : ""}`}>
        <Routes>
          <Route path="/" element={<Home setDarkMode={setDarkMode} darkMode={darkMode} />} />
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route path="/signup" element={<Signup darkMode={darkMode} />} />
          <Route path="/forgot-password" element={<ForgotPassword darkMode={darkMode} />} />
          <Route path="/reset-password" element={<ResetPassword darkMode={darkMode} />} />
          <Route path="/prediction" element={<PredictionForm darkMode={darkMode} />} />
          <Route path="/results" element={<ResultsPage darkMode={darkMode} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
