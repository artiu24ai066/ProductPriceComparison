require("dotenv").config(); // ✅ NEW

const express = require("express");
const cors = require("cors");

// Import sample scraper
const { scrapeSampleProduct } = require("./scraper/sampleScraper");

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Product comparison API
app.get("/api/products", (req, res) => {
  const { query } = req.query;

  const results = scrapeSampleProduct(query);

  res.json({
    search: query,
    results
  });
});

// Start server (UPDATED)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
