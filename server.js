const express = require("express");  // Import Express
const fetch = require("node-fetch"); // Import fetch for API requests
require("dotenv").config(); // Load environment variables

const app = express(); // ✅ Define the Express app

app.use(express.json()); // Middleware to parse JSON requests

const PORT = process.env.PORT || 3000;
const JSONBIN_URL = "https://api.jsonbin.io/v3/b"; 
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

app.get("/proxy", async (req, res) => {
    try {
        console.log("Fetching data from JSONBin...");
        console.log("Using API Key:", JSONBIN_API_KEY ? "Loaded" : "Not Loaded");

        const response = await fetch(`${JSONBIN_URL}/67ddb9d58a456b79667a302f/latest`, {
            method: "GET",
            headers: {
                "X-Master-Key": JSONBIN_API_KEY,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Fetch error:", error.message);
        res.status(500).json({ error: "Error fetching JSONBin data", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});