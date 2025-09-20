import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 📌 Chat with AI (text-based)
export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a Recipe Finder assistant. 
      I have access to recipe categories:
      - Vegetarian: { type: "meal", value: "Vegetarian" }
      - Non-Veg: { type: "meal", value: "Chicken" }
      - Desserts: { type: "meal", value: "Dessert" }
      - Drinks: { type: "drink", value: "Cocktail" }

      🎯 Rules for answering:
      1. If the user greets (e.g., "hi", "hello"), reply with a friendly greeting like:
         "Hey there! What do you want to eat today?"
      2. If the user provides a recipe name → give full details (ingredients, preparation steps, and category).
      3. If the user provides ingredients (e.g., "I have chicken and rice") → suggest possible recipes using those ingredients and then provide details.
      4. If the user asks something unrelated to food or recipes → reply:
         "This is a Recipe Finder app. I can help you with recipes, ingredients, and cooking guidance."
      5. Keep responses short, clear, and recipe-focused.

      User's Question: ${message}
    `;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Something went wrong with the AI service" });
  }
};
