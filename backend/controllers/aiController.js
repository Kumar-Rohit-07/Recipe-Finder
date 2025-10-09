// controllers/aiController.js
import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 📌 AI Chat Controller
export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const prompt = `
      You are a Recipe Finder assistant. 
      Categories: Vegetarian, Non-Veg, Desserts, Drinks.

      Rules:
      - If user greets → reply friendly.
      - If user gives a recipe name → provide ingredients + procedure.
      - If user lists ingredients → suggest possible recipes + steps.
      - If query is unrelated → reply: "This is a Recipe Finder app. I can help with recipes, ingredients, and cooking guidance."
      - Keep responses concise and recipe-focused.

      User: ${message}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const response = await model.generateContent(prompt);
    const output = response.response.text();

    res.json({ reply: output });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to process AI request" });
  }
};

// ✅ NEW: Translation Controller for Guide.jsx
export const translateStep = async (req, res) => {
  try {
    const { step, language } = req.body;

    if (!step || !language) {
      return res.status(400).json({ error: "Step and language are required" });
    }

    const options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
      data: {
        q: step,
        target: language,
      },
    };

    const response = await axios.request(options);
    const translatedText = response.data.data.translations[0].translatedText;

    res.json({ translatedText });
  } catch (error) {
    console.error("Translation Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Translation failed" });
  }
};
