import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Prediction.css";

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    hand: "",
    age: "",
    mmse: "",
    cdr: "",
    etiv: "",
    nwbv: "",
    asf: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setFormData((prevData) => ({
        ...prevData,
        name: parsedUser.name || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = ["age", "mmse", "cdr", "etiv", "nwbv", "asf"].includes(name)
      ? value.replace(/[^0-9.]/g, "")
      : value;
    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const determineStageAndPrecautions = (mmse, cdr) => {
    let stage = "";
    let precautions = [];

    if (mmse >= 24 && cdr === 0) {
      stage = "No Dementia";
      precautions = [
        "Maintain a healthy diet and exercise regularly.",
        "Engage in cognitive activities like reading and puzzles.",
        "Regular health check-ups to monitor cognitive function.",
        "Manage stress through meditation or social interactions.",
        "Ensure good sleep hygiene for brain health.",
      ];
    } else if (mmse >= 20 && mmse < 24 && cdr === 0.5) {
      stage = "Mild Cognitive Impairment (MCI)";
      precautions = [
        "Adopt a brain-healthy lifestyle with a balanced diet.",
        "Engage in memory-enhancing activities like learning new skills.",
        "Regular medical check-ups for early intervention.",
        "Manage other health conditions like diabetes or hypertension.",
        "Stay socially active to maintain mental well-being.",
      ];
    } else if (mmse >= 10 && mmse < 20 && cdr === 1) {
      stage = "Mild Alzheimer's Disease";
      precautions = [
        "Consult a doctor for medical assessment and medication if needed.",
        "Create reminders and schedules to assist daily activities.",
        "Ensure a safe home environment to prevent accidents.",
        "Encourage participation in familiar activities.",
        "Provide emotional and social support for the patient.",
      ];
    } else if (mmse >= 5 && mmse < 10 && cdr === 2) {
      stage = "Moderate Alzheimer's Disease";
      precautions = [
        "Ensure 24/7 supervision for safety and assistance.",
        "Use simple communication and avoid overwhelming the patient.",
        "Modify the home for safety, such as removing hazards.",
        "Encourage physical activities like walking under supervision.",
        "Provide a structured daily routine to reduce confusion.",
      ];
    } else if (mmse < 5 && cdr === 3) {
      stage = "Severe Alzheimer's Disease";
      precautions = [
        "Full-time caregiving and medical supervision required.",
        "Ensure a comfortable and familiar environment.",
        "Monitor for difficulties in swallowing and assist with eating.",
        "Provide skin care and prevent bedsores for bedridden patients.",
        "Use soft lighting and calming sounds to reduce agitation.",
      ];
    } else {
      stage = "Unknown Stage";
      precautions = ["Consult a doctor for further evaluation."];
    }

    return { stage, precautions };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (Object.values(formData).some((val) => val === "")) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    const mmseValue = parseFloat(formData.mmse);
    const cdrValue = parseFloat(formData.cdr);

    if (isNaN(mmseValue) || isNaN(cdrValue)) {
      setError("Invalid input for MMSE or CDR.");
      setLoading(false);
      return;
    }

    const { stage, precautions } = determineStageAndPrecautions(mmseValue, cdrValue);

    // Ensure precautions is an array before sending
    const precautionsArray = Array.isArray(precautions) ? precautions : [precautions];

    try {
      const response = await fetch("http://localhost:5000/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          prediction: "Alzheimer's Prediction Based on Input",
          stage,
          precautions: precautionsArray, // Send as an array
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save prediction.");
      }

      navigate("/results", {
        state: {
          prediction: "Alzheimer's Prediction Based on Input",
          stage,
          precautions: precautionsArray, // Pass as an array to results page
          patientDetails: formData,
        },
      });
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving the prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-container">
      <div className="form-box">
        <h2>Alzheimer's Prediction Form</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-left">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />

              <label>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required />

              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <label>Hand</label>
              <select name="hand" value={formData.hand} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Right">Right</option>
              </select>
            </div>

            <div className="form-right">
              <label>MMSE</label>
              <input type="number" name="mmse" value={formData.mmse} onChange={handleChange} required />

              <label>CDR</label>
              <input type="number" name="cdr" value={formData.cdr} onChange={handleChange} required />

              <label>eTIV</label>
              <input type="number" name="etiv" value={formData.etiv} onChange={handleChange} required />

              <label>nWBV</label>
              <input type="number" name="nwbv" value={formData.nwbv} onChange={handleChange} required />

              <label>ASF</label>
              <input type="number" name="asf" value={formData.asf} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="predict-button" disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {error && <div className="error-box">{error}</div>}
      </div>
    </div>
  );
};

export default PredictionForm;


