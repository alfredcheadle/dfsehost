const cors = require("cors"); // Import CORS
const express = require("express"); // Import Express
const fetch = require("node-fetch"); // Import fetch for API requests
require("dotenv").config(); // Load environment variables

const app = express(); // ✅ Define the Express app

const allowedOrigins = [ // Allow accepted domains: 
    "https://www.weareplannedparenthood.org",
    "https://www.weareplannedparenthoodaction.org/",
    "https://www.weareplannedparenthoodvotes.org/"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true); // Allow the request
            } else {
                callback(new Error("Not allowed by CORS")); // Block the request
            }
        },
        methods: "GET, PUT",
        allowedHeaders: ["Content-Type"],
    })
);

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

// PUT request to update data in JSONBin
app.put("/proxy", async (req, res) => {
    const updatedData = req.body; // Expecting data in the request body

    try {
        console.log("Updating data in JSONBin...");

        const response = await fetch(`${JSONBIN_URL}/67ddb9d58a456b79667a302f`, {
            method: "PUT",
            headers: {
                "X-Master-Key": JSONBIN_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData) // Send updated data
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Update error:", error.message);
        res.status(500).json({ error: "Error updating JSONBin data", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});