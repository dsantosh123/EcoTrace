// Load environment variables from .env file at the very start
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());              // Enable CORS for all origins (adjust if needed)
app.use(express.json());      // Parse JSON bodies from HTTP requests

// Import Authentication Routes
const authRoutes = require("./routes/auth.routes");

// Register routes with prefix /api/auth
app.use("/api/auth", authRoutes);

// Test root endpoint to verify server is working
app.get("/", (req, res) => {
  res.send("EcoTrace API is running");
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,  // (Optional) depending on mongoose version
})
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
  });

// Optional: Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Optional: Global error handling middleware (if you want)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});
