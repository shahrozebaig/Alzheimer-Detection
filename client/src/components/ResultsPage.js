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

  const handleDownloadPDF = async () => {
    const input = document.getElementById("pdf-content");
    const buttons = document.getElementById("pdf-buttons");
    const wasDarkMode = document.body.classList.contains("dark-mode");

    if (buttons) buttons.style.display = "none";
    if (wasDarkMode) document.body.classList.remove("dark-mode");

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // QR code generation and addition removed here

      pdf.setFontSize(10);
      pdf.text("Page 1", pdfWidth - 20, pdf.internal.pageSize.height - 10);

      pdf.save("Alzheimers_Prediction_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF.");
    } finally {
      if (buttons) buttons.style.display = "flex";
      if (wasDarkMode) document.body.classList.add("dark-mode");
    }
  };

  return (
    <div className="results-container">
      <div className="results-box" id="pdf-content">
        <div className="pdf-header">
          <img src={logo} alt="Logo" className="pdf-logo" />
          <h2 className="pdf-title">Alzheimer's Prediction Report</h2>
        </div>

        {prediction ? (
          <>
            <table className="results-table">
              <thead>
                <tr>
                  <th colSpan="2">Patient Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{patientDetails.name || "Not Provided"}</td>
                </tr>
                <tr>
                  <td>Age</td>
                  <td>{patientDetails.age || "Not Provided"}</td>
                </tr>
                <tr>
                  <td>Gender</td>
                  <td>{patientDetails.gender || "Not Provided"}</td>
                </tr>
                <tr>
                  <td>MMSE</td>
                  <td>{patientDetails.mmse || "Not Provided"}</td>
                </tr>
                <tr>
                  <td>CDR</td>
                  <td>{patientDetails.cdr || "Not Provided"}</td>
                </tr>
                <tr>
                  <td>eTIV</td>
                  <td>{patientDetails.etiv || "Not Provided"}</td>
                </tr>
                <tr>
                  <td>nWBV</td>
                  <td>{patientDetails.nwbv || "Not Provided"}</td>
                </tr>
                <tr>
                  <td>ASF</td>
                  <td>{patientDetails.asf || "Not Provided"}</td>
                </tr>
              </tbody>
            </table>

            <table className="results-table">
              <thead>
                <tr>
                  <th colSpan="2">Prediction Outcome</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Prediction</td>
                  <td>{prediction}</td>
                </tr>
                <tr>
                  <td>Stage</td>
                  <td>{stage}</td>
                </tr>
              </tbody>
            </table>

            <table className="results-table">
              <thead>
                <tr>
                  <th>Precautionary Measures</th>
                </tr>
              </thead>
              <tbody>
                {precautionsList.length > 0 ? (
                  precautionsList.map((item, index) => (
                    <tr key={index}>
                      <td>{item}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>No specific precautions provided.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        ) : (
          <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>
            No prediction data available. Please try submitting the form again.
          </p>
        )}

        <div className="results-buttons" id="pdf-buttons">
          <button className="back-btn" onClick={() => navigate("/")}>
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
