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
        <div className="logo" tabIndex={0} aria-label="Alzheimer's Predictor logo">
          🧠 Alzheimer's Predictor
        </div>
        <nav className="nav" role="navigation" aria-label="Primary navigation">
          <Link to="/login" className="nav-link" tabIndex={0}>
            Login
          </Link>
          <Link to="/signup" className="nav-link" tabIndex={0}>
            Signup
          </Link>
          <button
            onClick={toggleDarkMode}
            className="mode-toggle"
            aria-pressed={darkMode}
            tabIndex={0}
            aria-label="Toggle dark/light mode"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" aria-label="Hero section">
        <div className="hero-content">
          <h1>Predict Alzheimer’s Risk Early</h1>
          <p>Use our smart AI tool to detect the risk of Alzheimer’s before it’s too late.</p>
          <Link to="/login" className="get-started" tabIndex={0}>
            Get Started
          </Link>
        </div>
        <img
          src={BrainImage}
          alt="Illustration of a brain with AI neural network connections"
          className="hero-image"
          loading="lazy"
        />
      </section>

      {/* Features */}
      <section className="features" aria-label="Features and benefits">
        <h2>Why Use Our Predictor?</h2>
        <div className="features-grid">
          <div className="feature-card" tabIndex={0}>⚡ Fast & Accurate AI</div>
          <div className="feature-card" tabIndex={0}>🧬 Science-Based Inputs</div>
          <div className="feature-card" tabIndex={0}>🔒 100% Private</div>
          <div className="feature-card" tabIndex={0}>🆓 Completely Free</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" aria-label="Testimonials from users">
        <h2>What People Are Saying</h2>
        <blockquote className="testimonial-card" tabIndex={0}>
          <p>"This platform gave my family a head start in managing health. Amazing!"</p>
          <footer>- Dr. Aisha Verma</footer>
        </blockquote>
        <blockquote className="testimonial-card" tabIndex={0}>
          <p>"Beautiful interface and easy to use. Definitely recommend it!"</p>
          <footer>- John Reynolds</footer>
        </blockquote>
      </section>

      {/* FAQ */}
      <section className="faq" aria-label="Frequently Asked Questions">
        <h2>FAQs</h2>
        <div
          className="faq-item"
          onClick={() => toggleFAQ(1)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleFAQ(1); }}
          role="button"
          tabIndex={0}
          aria-expanded={faqOpen === 1}
          aria-controls="faq1-content"
          id="faq1"
        >
          <h3>How does it work? {faqOpen === 1 ? "▲" : "▼"}</h3>
          {faqOpen === 1 && (
            <p id="faq1-content">
              We use medical input data and AI models to analyze patterns and predict Alzheimer’s risk.
            </p>
          )}
        </div>
        <div
          className="faq-item"
          onClick={() => toggleFAQ(2)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleFAQ(2); }}
          role="button"
          tabIndex={0}
          aria-expanded={faqOpen === 2}
          aria-controls="faq2-content"
          id="faq2"
        >
          <h3>Is it really free? {faqOpen === 2 ? "▲" : "▼"}</h3>
          {faqOpen === 2 && (
            <p id="faq2-content">
              Yes! This project is free for users and backed by research initiatives.
            </p>
          )}
        </div>
      </section>

      {/* Contact */}
      <section className="contact" aria-label="Contact form">
        <h2>Contact Us</h2>
        <form noValidate>
          <input type="text" placeholder="Your Name" required aria-label="Your Name" />
          <input type="email" placeholder="Your Email" required aria-label="Your Email" />
          <textarea placeholder="Your Message" required aria-label="Your Message"></textarea>
          <button type="submit" className="submit-button">
            Send
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <p>&copy; 2025 Alzheimer's Predictor. All rights reserved.</p>
        <div className="socials" aria-label="Social media links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" tabIndex={0}>
            Facebook
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" tabIndex={0}>
            Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" tabIndex={0}>
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
