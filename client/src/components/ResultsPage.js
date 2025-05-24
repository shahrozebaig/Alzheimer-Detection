import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import "./ResultsPage.css";
import logo from "../assets/pngtree-cross-plus-medical-logo-icon-design-template-image_145195.jpg";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data from location state or fallback
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

  const handleDownloadPDF = async () => {
    const input = document.getElementById("pdf-content");
    const buttons = document.getElementById("pdf-buttons");

    // Check and remove dark mode before capture
    const wasDarkMode = document.body.classList.contains("dark-mode");
    if (buttons) buttons.style.display = "none";
    if (wasDarkMode) document.body.classList.remove("dark-mode");

    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // Create PDF and add image
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Generate QR code with patient and prediction data
      const qrData = `
Name: ${patientDetails.name || "Not Provided"}
Age: ${patientDetails.age || "Not Provided"}
Gender: ${patientDetails.gender || "Not Provided"}
MMSE: ${patientDetails.mmse || "Not Provided"}
CDR: ${patientDetails.cdr || "Not Provided"}
eTIV: ${patientDetails.etiv || "Not Provided"}
nWBV: ${patientDetails.nwbv || "Not Provided"}
ASF: ${patientDetails.asf || "Not Provided"}
Prediction: ${prediction}
Stage: ${stage}`.trim();

      const qrImageUrl = await QRCode.toDataURL(qrData);

      // Add QR code to PDF
      pdf.addImage(qrImageUrl, "PNG", pdfWidth - 50, pdfHeight - 50, 40, 40);

      // Footer: Page number
      pdf.setFontSize(10);
      pdf.text("Page 1", pdfWidth - 20, pdf.internal.pageSize.height - 10);

      // Save the PDF
      pdf.save("Alzheimers_Prediction_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF.");
    } finally {
      // Restore dark mode and buttons if needed
      if (buttons) buttons.style.display = "flex";
      if (wasDarkMode) document.body.classList.add("dark-mode");
    }
  };

  return (
    <div className="results-container">
      <div className="results-box" id="pdf-content">
        <div className="pdf-header">
          <img src={logo} alt="Logo" className="pdf-logo" />
          <h2>Alzheimer's Prediction Report</h2>
        </div>

        {prediction ? (
          <>
            <div className="patient-info">
              <h3>Patient Details</h3>
              <p><strong>Name:</strong> {patientDetails.name || "Not Provided"}</p>
              <p><strong>Age:</strong> {patientDetails.age || "Not Provided"}</p>
              <p><strong>Gender:</strong> {patientDetails.gender || "Not Provided"}</p>
              <p><strong>MMSE:</strong> {patientDetails.mmse || "Not Provided"}</p>
              <p><strong>CDR:</strong> {patientDetails.cdr || "Not Provided"}</p>
              <p><strong>eTIV:</strong> {patientDetails.etiv || "Not Provided"}</p>
              <p><strong>nWBV:</strong> {patientDetails.nwbv || "Not Provided"}</p>
              <p><strong>ASF:</strong> {patientDetails.asf || "Not Provided"}</p>
            </div>

            <div className="prediction-info">
              <h3>Prediction Outcome</h3>
              <p><strong>Prediction:</strong> {prediction}</p>
              <p><strong>Stage:</strong> {stage}</p>

              <h3>Precautionary Measures</h3>
              <ul>
                {precautionsList.length > 0 ? (
                  precautionsList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>No specific precautions provided.</li>
                )}
              </ul>
            </div>
          </>
        ) : (
          <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>
            No prediction data available. Please try submitting the form again.
          </p>
        )}

        <div className="results-buttons" id="pdf-buttons">
          <button className="home-button" onClick={() => navigate("/")}>
            Back Home
          </button>
          {prediction && (
            <button className="download-button" onClick={handleDownloadPDF}>
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
