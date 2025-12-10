require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🚨 Check API key before starting
if (!process.env.GOOGLE_API_KEY) {
  console.error("\n❌ MISSING GOOGLE_API_KEY in .env file!\n");
  console.warn("👉 Add this to your .env:");
  console.warn("GOOGLE_API_KEY=your_api_key_here\n");
  process.exit(1); // Stop the server safely
}

// Initialize Gemini AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

// Generate Quiz Questions
app.post("/generate-quiz", async (req, res) => {
  const { category, difficulty, count } = req.body;

  // 🛑 Validate user input
  if (!category || !difficulty || !count) {
    return res.status(400).json({
      error: "Missing required fields: category, difficulty, or count"
    });
  }

  try {
    const prompt = `
      Generate ${count} multiple-choice questions about ${category}.
      Difficulty: ${difficulty}.

      Rules:
      - Provide exactly 4 options (A, B, C, D).
      - Shuffle the options so the correct answer is not always first.
      - Ensure "answer" value exactly matches one of the options.
      - Do NOT explain, just output valid JSON.

      Format exactly like this:
      [
        {
          "question": "What does CPU stand for?",
          "options": ["Central Processing Unit", "Compute Power Utility", "Control Processing Unit", "Central Power Unit"],
          "answer": "Central Processing Unit"
        }
      ]
    `;

    // 🧠 AI Request
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    let responseText = result.text;

    // 🧹 Clean json formatting if model adds ```json
    responseText = responseText.replace(/```json|```/g, "").trim();

    // 🛡 Safe JSON parse
    try {
      const parsedData = JSON.parse(responseText);
      return res.json(parsedData);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      console.error("⚠ AI Response:", responseText);
      return res.status(500).json({
        error: "AI returned invalid JSON. Try again."
      });
    }

  } catch (error) {
    console.error("❌ Error generating quiz:", error);

    // 🌐 Handle timeouts or busy server
    if (error.status === 503) {
      return res.status(503).json({
        error: "AI server is busy. Please try again later."
      });
    }

    // 🔐 Invalid or expired API key
    if (error.status === 401) {
      return res.status(401).json({
        error: "Invalid or expired API key."
      });
    }

    // 🪫 General fallback
    return res.status(500).json({
      error: "Failed to generate quiz. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
