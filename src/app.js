const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Frontend ko serve karo
app.use(express.static(path.join(__dirname, "../frontend")));

// Gemini AI initialize karo
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// POST route jo frontend se question receive kare
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    console.log(question)

    // Validation
    if (!question || question.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Question cannot be empty."
      });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "API key is not configured."
      });
    }

    // Model get (gemini-2.5-flash as specified)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Send question to Gemini
    const result = await model.generateContent(question);
    const answer = result.response.text();

    // Return response to frontend
    res.json({
      success: true,
      question: question,
      answer: answer
    });

  } catch (error) {
    console.error("Gemini API error:", error.message);
    
    let errorMsg = error.message || "Could not get response from Gemini. Please try again.";
    if (error.message && (error.message.includes("429") || error.message.includes("Quota exceeded"))) {
      errorMsg = "API Free Quota limit exceeded. Please try again in 1 minute or check your API key.";
    }

    res.status(500).json({
      success: false,
      error: errorMsg
    });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "Server is running ✅" });
});

module.exports = app