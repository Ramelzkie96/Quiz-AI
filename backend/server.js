require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY // ensure your .env uses this exact name
});

// Generate Quiz Questions
app.post("/generate-quiz", async (req, res) => {
  const { category, difficulty, count } = req.body;

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

    // Generate content directly with ai.models.generateContent
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    // `result.text` contains the output string
    let responseText = result.text;

    // Clean up any ```json blocks if added automatically
    responseText = responseText.replace(/```json|```/g, "").trim();

    // Return parsed JSON
    return res.json(JSON.parse(responseText));
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
