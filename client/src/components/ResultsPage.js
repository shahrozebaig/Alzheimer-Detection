import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ResultsPage.css";
import logo from "../assets/pngtree-cross-plus-medical-logo-icon-design-template-image_145195.jpg";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    prediction = "",
    stage = "",
    precautions = [],
    patientDetails = {},
  } = location.state || {};

  const precautionsList = Array.isArray(precautions)
    ? precautions
    : precautions
    ? [precautions]
    : [];

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownloadPDF = async () => {
    const input = document.getElementById("pdf-content");
    const buttons = document.getElementById("pdf-buttons");
    const wasDarkMode = document.body.classList.contains("dark-mode");

    const originalButtonsDisplay = buttons.style.display;
    const originalButtonsPosition = buttons.style.position;
    const originalButtonsVisibility = buttons.style.visibility;

    if (buttons) {
      buttons.style.visibility = "hidden";
      buttons.style.position = "relative";
      buttons.style.display = "grid";
    }

    if (wasDarkMode) document.body.classList.remove("dark-mode");

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Alzheimers_Medical_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF.");
    } finally {
      if (buttons) {
        buttons.style.visibility = originalButtonsVisibility;
        buttons.style.position = originalButtonsPosition;
        buttons.style.display = originalButtonsDisplay;
      }
      if (wasDarkMode) document.body.classList.add("dark-mode");
    }
  };

  return (
    <div className="results-container">
      <div className="results-box" id="pdf-content">
        <div className="pdf-header">
          <img src={logo} alt="Medical Logo" className="pdf-logo" />
          <div className="header-text">
            <h1 className="pdf-title">Alzheimer's Disease Assessment Report</h1>
            <p className="hospital-name">Medical Diagnostic Center</p>
          </div>
        </div>

        <div className="report-info">
          <div className="report-details">
            <p><strong>Date:</strong> {currentDate}</p>
          </div>
          <div className="doctor-info">
            <p><strong>Authorized By:</strong> Dr. Sarah Johnson</p>
            <p><strong>Department:</strong> Neurology</p>
          </div>
        </div>

        <div className="report-section">
          <h2 className="section-title">Patient Information</h2>
          <table className="results-table">
            <tbody>
              <tr>
                <td className="label">Full Name</td>
                <td>{patientDetails.name || "Not Provided"}</td>
                <td className="label">Age</td>
                <td>{patientDetails.age || "Not Provided"}</td>
              </tr>
              <tr>
                <td className="label">Gender</td>
                <td>{patientDetails.gender || "Not Provided"}</td>
                <td className="label">Report Date</td>
                <td>{currentDate}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="report-section">
          <h2 className="section-title">Clinical Assessment</h2>
          <table className="results-table">
            <tbody>
              <tr>
                <td className="label">MMSE Score</td>
                <td>{patientDetails.mmse || "Not Provided"}</td>
                <td className="label">CDR Score</td>
                <td>{patientDetails.cdr || "Not Provided"}</td>
              </tr>
              <tr>
                <td className="label">eTIV (ml)</td>
                <td>{patientDetails.etiv || "Not Provided"}</td>
                <td className="label">nWBV</td>
                <td>{patientDetails.nwbv || "Not Provided"}</td>
              </tr>
              <tr>
                <td className="label">ASF</td>
                <td colSpan="3">{patientDetails.asf || "Not Provided"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="report-section">
          <h2 className="section-title">Diagnostic Findings</h2>
          <table className="results-table">
            <tbody>
              <tr>
                <td className="label">Assessment Result</td>
                <td>{prediction}</td>
              </tr>
              <tr>
                <td className="label">Disease Stage</td>
                <td>{stage}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="report-section">
          <h2 className="section-title">Clinical Recommendations</h2>
          <div className="precautions-list">
            {precautionsList.length > 0 ? (
              precautionsList.map((item, index) => (
                <div key={index} className="precaution-item">
                  <span className="bullet">•</span>
                  <p>{item}</p>
                </div>
              ))
            ) : (
              <p className="no-precautions">No specific recommendations provided.</p>
            )}
          </div>
        </div>

        <div className="report-footer">
          <div className="signature-section">
            <div className="signature-line"></div>
            <p>Dr. Sarah Johnson</p>
            <p className="signature-title">Neurologist</p>
          </div>
          <div className="disclaimer">
            <p><em>This is a computer-generated report and does not require a physical signature.</em></p>
            <p><em>For any queries, please contact our medical department.</em></p>
          </div>
        </div>

        <div className="results-buttons" id="pdf-buttons">
          <button className="back-btn" onClick={() => navigate("/")}>
            Back Home
          </button>
          {prediction && (
            <button className="download-button" onClick={handleDownloadPDF}>
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
