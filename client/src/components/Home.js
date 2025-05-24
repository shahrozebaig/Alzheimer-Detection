import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import BrainImage from "../assets/AIinforole-720x500.jpg"; // ✅ Your custom brain image

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  const toggleFAQ = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className={`home-container ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <header className="header">
        <div className="logo">🧠 Alzheimer's Predictor</div>
        <nav className="nav">
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          <button onClick={toggleDarkMode} className="mode-toggle">
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Predict Alzheimer’s Risk Early</h1>
          <p>Use our smart AI tool to detect the risk of Alzheimer’s before it’s too late.</p>
          <Link to="/login" className="get-started">Get Started</Link> {/* ✅ Changed to /login */}
        </div>
        <img src={BrainImage} alt="Brain AI" className="hero-image" />
      </section>

      {/* Features */}
      <section className="features">
        <h2>Why Use Our Predictor?</h2>
        <div className="features-grid">
          <div className="feature-card">⚡ Fast & Accurate AI</div>
          <div className="feature-card">🧬 Science-Based Inputs</div>
          <div className="feature-card">🔒 100% Private</div>
          <div className="feature-card">🆓 Completely Free</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What People Are Saying</h2>
        <div className="testimonial-card">
          <p>"This platform gave my family a head start in managing health. Amazing!"</p>
          <h4>- Dr. Aisha Verma</h4>
        </div>
        <div className="testimonial-card">
          <p>"Beautiful interface and easy to use. Definitely recommend it!"</p>
          <h4>- John Reynolds</h4>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <h2>FAQs</h2>
        <div className="faq-item" onClick={() => toggleFAQ(1)}>
          <h3>How does it work? {faqOpen === 1 ? "▲" : "▼"}</h3>
          {faqOpen === 1 && <p>We use medical input data and AI models to analyze patterns and predict Alzheimer’s risk.</p>}
        </div>
        <div className="faq-item" onClick={() => toggleFAQ(2)}>
          <h3>Is it really free? {faqOpen === 2 ? "▲" : "▼"}</h3>
          {faqOpen === 2 && <p>Yes! This project is free for users and backed by research initiatives.</p>}
        </div>
      </section>

      {/* Contact */}
      <section className="contact">
        <h2>Contact Us</h2>
        <form>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit">Send</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Alzheimer's Predictor. All rights reserved.</p>
        <div className="socials">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
