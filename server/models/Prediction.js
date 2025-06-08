const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Optional if not logged in
    name: { type: String, required: true, trim: true },
    email: { type: String, required: false, trim: true }, // Optional
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    hand: { type: String, required: true, enum: ["Left", "Right"] },
    age: { type: Number, required: true, min: 0 },
    mmse: { type: Number, required: true, min: 0 },
    cdr: { type: Number, required: true, min: 0 },
    etiv: { type: Number, required: true, min: 0 },
    nwbv: { type: Number, required: true, min: 0 },
    asf: { type: Number, required: true, min: 0 },
    prediction: { type: String, required: true }, // Alzheimer's result (Yes/No)
    stage: { type: String, default: null }, // Stage of Alzheimer's
    precautions: { type: [String], default: [] }, // Ensure precautions is an array of strings
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Prediction", predictionSchema);
