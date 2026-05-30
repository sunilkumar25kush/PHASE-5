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

    // Validation
    if (!question || question.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Question khali nahi ho sakta"
      });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "API key configured nahi hai"
      });
    }

    // Model get karo
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Gemini ko question bhejo
    const result = await model.generateContent(question);

    console.log("API RESULT: ",result)

    // Response nikal lo
    const answer = result.response.text();

    // Frontend ko answer bhejo
    res.json({
      success: true,
      question: question,
      answer: answer
    });

  } catch (error) {
    console.error("Gemini API error:", error.message);
    console.error("Full error:", error);
    
    res.status(500).json({
      success: false,
      error: error.message || "Gemini se answer nahi mil saka. Dobara try karo."
    });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "Server chal raha hai ✅" });
});

module.exports = app