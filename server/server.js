require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const predictionRoutes = require("./routes/predictRoutes"); // ✅ Prediction Route
const authRoutes = require("./routes/authRoutes"); // ✅ Authentication Route

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // ✅ React frontend URL
    credentials: true,
  })
);
app.use(express.json()); // ✅ Parse JSON requests

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes); // ✅ User Authentication
app.use("/api/predictions", predictionRoutes); // ✅ Alzheimer's Prediction

// Alzheimer’s Prediction API (calling the Python script)
app.post("/api/predict", (req, res) => {
  const { name, age, gender, mmse, cdr, etiv, nwbv, asf } = req.body;

  // Build the command to run the Python script with input data
  const pythonScriptPath = path.join(__dirname, 'python', 'predict.py'); // Corrected path
  const command = `python "${pythonScriptPath}" ${name} ${age} ${gender} ${mmse} ${cdr} ${etiv} ${nwbv} ${asf}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Prediction failed');
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('Prediction failed');
    }

    // Parse the result (stdout)
    const predictionResult = JSON.parse(stdout);

    // Send the result back to the frontend
    res.json(predictionResult);
  });
});

// Root Check (optional)
app.get("/", (req, res) => {
  res.send("Alzheimer's Detection API is running...");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
