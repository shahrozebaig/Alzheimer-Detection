import React, { useState, useEffect } from "react";
import "./Help.css";

const Help = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Add/remove dark-mode class on body or help-container
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("help-dark-mode");
    } else {
      document.body.classList.remove("help-dark-mode");
    }
    // Cleanup on unmount
    return () => {
      document.body.classList.remove("help-dark-mode");
    };
  }, [darkMode]);

  return (
    <div className={`help-container ${darkMode ? "dark" : ""}`}>
      <button
        className="back-btn"
        onClick={() => window.history.back()}
      >
        Back
      </button>

      <button
        className="dark-toggle-btn"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      <h2>How We Classify Alzheimer's Stages</h2>

      <p>
        Our Alzheimer’s prediction system uses four main factors to determine
        the cognitive stage:
      </p>

      <ul>
        <li>
          <strong>MMSE (Mini-Mental State Examination):</strong> Measures
          cognitive function.
        </li>
        <li>
          <strong>CDR (Clinical Dementia Rating):</strong> Evaluates the
          severity of dementia.
        </li>
        <li>
          <strong>nWBV (Normalized Whole Brain Volume):</strong> Brain size
          (adjusted for head size).
        </li>
        <li>
          <strong>eTIV (Estimated Total Intracranial Volume):</strong> Overall
          skull/brain capacity.
        </li>
      </ul>

      <h3>General Logic</h3>
      <p>
        - <strong>Higher MMSE</strong> → Better cognitive function.
        <br />
        - <strong>Lower CDR</strong> → Less cognitive impairment.
        <br />
        - <strong>Higher nWBV (above 0.7)</strong> → Healthier brain volume.
        <br />
        - <strong>Lower eTIV (below ~1600–1800)</strong> → Less brain atrophy.
      </p>

      <h3>Stages in Detail</h3>
      <table className="stages-table">
        <thead>
          <tr>
            <th>Stage</th>
            <th>MMSE</th>
            <th>CDR</th>
            <th>nWBV</th>
            <th>eTIV (approx)</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>No Cognitive Impairment</td>
            <td>27–29</td>
            <td>0</td>
            <td>≥ 0.75</td>
            <td>≤ 1500</td>
            <td>Excellent cognitive health. Healthy brain size & volume.</td>
          </tr>
          <tr>
            <td>Mild Cognitive Impairment (MCI)</td>
            <td>24–26</td>
            <td>0 or 0.5</td>
            <td>≥ 0.72</td>
            <td>≤ 1600</td>
            <td>Minor issues; early signs of cognitive decline.</td>
          </tr>
          <tr>
            <td>Mild Alzheimer's Disease</td>
            <td>18–23</td>
            <td>0.5 or 1</td>
            <td>≥ 0.65</td>
            <td>≤ 1700</td>
            <td>Noticeable issues with memory & thinking, but still functional.</td>
          </tr>
          <tr>
            <td>Moderate Alzheimer's</td>
            <td>10–17</td>
            <td>1 or 1.5</td>
            <td>≥ 0.60</td>
            <td>≤ 1800</td>
            <td>More pronounced symptoms, safety risks appear.</td>
          </tr>
          <tr>
            <td>Severe Alzheimer's</td>
            <td>&lt; 10</td>
            <td>1.5</td>
            <td>&lt; 0.60</td>
            <td>—</td>
            <td>Severe loss of cognitive & physical function.</td>
          </tr>
          <tr>
            <td>Uncertain Stage</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>Fallback for further evaluation.</td>
          </tr>
        </tbody>
      </table>

      <p>
        These guidelines help us provide a more robust and tailored prediction.
        For personalized results, please fill out the prediction form with
        accurate information.
      </p>
    </div>
  );
};

export default Help;
