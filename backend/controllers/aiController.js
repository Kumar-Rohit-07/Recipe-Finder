import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 📌 Chat with AI (unchanged, just kept for recipe chat)
export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a Recipe Finder assistant. 
      Categories: Vegetarian, Non-Veg, Desserts, Drinks.

      Rules:
      - Greetings → reply friendly.
      - Recipe name → give ingredients + procedure.
      - Ingredients list → suggest recipes + details.
      - Unrelated → reply: "This is a Recipe Finder app. I can help you with recipes, ingredients, and cooking guidance."
      - Keep responses short & recipe-focused.

      User: ${message}
    `;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Something went wrong with the AI service" });
  }
};

// 📌 New: Translate & enrich step
export const translateStep = async (req, res) => {
  try {
    const { step } = req.body;
    if (!step) {
      return res.status(400).json({ error: "Step is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Take this cooking step: "${step}"

      1. Keep the original English text as is.
      2. Translate it into Hindi (clear and natural).
      3. Add approximate measurements or extra cooking details if relevant (example: "Heat oil in a pan" → "Heat 30 ml oil in a pan").

      Respond in JSON format:
      {
        "english": "...",
        "hindi": "...",
        "details": "..."
      }
    `;

    const result = await model.generateContent(prompt);

    // Parse JSON safely
    let output;
    try {
      output = JSON.parse(result.response.text());
    } catch {
      output = {
        english: step,
        hindi: "अनुवाद उपलब्ध नहीं",
        details: "No extra details",
      };
    }

    res.json(output);
  } catch (error) {
    console.error("Gemini API Translation Error:", error);
    res.status(500).json({ error: "Failed to translate step" });
  }
};
