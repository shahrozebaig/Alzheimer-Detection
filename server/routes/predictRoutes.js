const express = require("express");
const router = express.Router();
const Prediction = require("../models/Prediction");

// Function to determine Alzheimer's stage and precautions
const determineAlzheimersStage = (mmse, cdr) => {
  let stage = "";
  let precautions = [];

  mmse = parseFloat(mmse);
  cdr = parseFloat(cdr);

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

// @route   POST /api/predictions
// @desc    Save prediction & return results only
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, gender, hand, age, mmse, cdr, etiv, nwbv, asf } = req.body;

    if (
      !name || !gender || !hand ||
      age === undefined || mmse === undefined || cdr === undefined ||
      etiv === undefined || nwbv === undefined || asf === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Parse values to ensure they are numbers
    const parsed = {
      age: parseFloat(age),
      mmse: parseFloat(mmse),
      cdr: parseFloat(cdr),
      etiv: parseFloat(etiv),
      nwbv: parseFloat(nwbv),
      asf: parseFloat(asf),
    };

    // Determine the Alzheimer's stage and precautions
    const { stage, precautions } = determineAlzheimersStage(parsed.mmse, parsed.cdr);

    const predictionResult =
      stage === "No Dementia" || stage === "Mild Cognitive Impairment (MCI)"
        ? "No Alzheimer's"
        : "Alzheimer's Detected";

    // Create a new prediction entry
    const newPrediction = new Prediction({
      name,
      gender,
      hand,
      ...parsed,
      prediction: predictionResult,
      stage,
      precautions: precautions.join(", "), // ✅ Fix: Convert array to string for database
      timestamp: new Date(),
    });

    // Save to the MongoDB database
    await newPrediction.save();

    // Log success after saving to DB
    console.log("✅ Prediction saved successfully in MongoDB!");

    // Send the response to the client
    res.status(200).json({
      prediction: predictionResult,
      stage,
      precautions,
    });
  } catch (error) {
    console.error("Error during prediction:", error.message);
    res.status(500).json({
      prediction: "Unable to determine",
      stage: "Unknown",
      precautions: ["An issue occurred. Please try again later or contact support."],
    });
  }
});

module.exports = router;