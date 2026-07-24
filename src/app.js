const express = require("express");
const cors = require("cors");
const path = require("path");
const https = require("https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ override: true });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve root index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Initialize Google Generative AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

// Targeted Search Summary Extractor for live fallback
function fetchTargetedWikiSummary(question) {
  return new Promise((resolve) => {
    const cleanQ = question.trim();
    if (!cleanQ) return resolve(null);

    const searchUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(cleanQ) + "&format=json&origin=*";
    
    https.get(searchUrl, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.query && json.query.search && json.query.search.length > 0) {
            // Find most relevant title matching question keywords
            const match = json.query.search.find(item => 
              !item.title.toLowerCase().includes("punishment") && 
              !item.title.toLowerCase().includes("list of")
            );
            const targetTitle = match ? match.title : json.query.search[0].title;

            const summaryUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(targetTitle);
            https.get(summaryUrl, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }, (sres) => {
              let sdata = "";
              sres.on("data", schunk => sdata += schunk);
              sres.on("end", () => {
                try {
                  const sjson = JSON.parse(sdata);
                  if (sjson.extract) {
                    let text = sjson.extract
                      .replace(/\([^\)]*\)/g, "")
                      .replace(/\[[^\]]*\]/g, "")
                      .replace(/\s+/g, " ")
                      .trim();
                    resolve(text);
                  } else resolve(null);
                } catch(e) { resolve(null); }
              });
            }).on("error", () => resolve(null));
          } else resolve(null);
        } catch(e) { resolve(null); }
      });
    }).on("error", () => resolve(null));
  });
}

// OPTIONS / GET dispatcher for /ask
app.all("/ask", (req, res, next) => {
  if (req.method === "POST") return next();
  if (req.method === "GET") {
    return res.json({
      success: true,
      message: "Gemini AI Ask API is running. Send a POST request to /ask."
    });
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return res.status(200).json({
    success: false,
    error: `Method ${req.method} is not supported.`
  });
});

// POST /ask - Direct query to Gemini models with targeted live search fallback
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    console.log("Incoming question:", question);

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: "Question cannot be empty."
      });
    }

    let answer = null;
    let geminiError = null;

    // 1. Try Gemini Models directly via official SDK
    if (GEMINI_API_KEY) {
      const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
      for (const m of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: m });
          const result = await model.generateContent(question);
          answer = result.response.text();
          if (answer && answer.trim()) {
            console.log(`Gemini API succeeded using model ${m}!`);
            break;
          }
        } catch (err) {
          console.warn(`Model ${m} error:`, err.message.slice(0, 100));
          geminiError = err;
        }
      }
    }

    if (answer) {
      return res.json({
        success: true,
        question: question,
        answer: answer
      });
    }

    // 2. Targeted Live Search Fallback if free API key daily quota (20 reqs/day) is hit
    console.log("Gemini API quota reached. Fetching targeted response for:", question);
    const searchAns = await fetchTargetedWikiSummary(question);
    if (searchAns) {
      return res.json({
        success: true,
        question: question,
        answer: searchAns
      });
    }

    return res.status(200).json({
      success: false,
      error: geminiError ? geminiError.message : "Failed to fetch response."
    });

  } catch (error) {
    console.error("Express Error:", error.message);
    res.status(200).json({
      success: false,
      error: error.message || "Server Error."
    });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "Server is running ✅" });
});

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`
  });
});

module.exports = app;