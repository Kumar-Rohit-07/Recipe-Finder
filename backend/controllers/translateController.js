import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

// ✅ Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Existing Translation Controller (UNCHANGED)
export const translateText = async (req, res) => {
  try {
    const { text, target } = req.body;

    if (!text || !target) {
      return res.status(400).json({ error: "Text and target language are required" });
    }

    // 🧠 Create Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 🌍 Intelligent translation + enhancement prompt
    const prompt = `
You are an expert cooking assistant AI.
Translate and enhance the following cooking step into **${target}** language.

Your job:
- Translate the text naturally and clearly in ${target}.
- Simplify and clarify the instructions if needed.
- Add small helpful cooking details or tips (in the same ${target} language) if relevant.
- Maintain the meaning and cooking intent accurately.

Input text:
"""
${text}
"""

Output:
Provide only the translated and enhanced step in ${target} language — no English, no formatting, no explanations.
    `;

    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      throw new Error("Empty response from Gemini API");
    }

    const translatedText = result.response.text().trim();

    console.log(`✅ Enhanced translation (${target}):`, translatedText);

    res.json({ translatedText });
  } catch (error) {
    console.error("❌ Translation API Error:", error.message || error);
    if (error.response) {
      console.error("Gemini response error:", error.response.data);
    }
    res.status(500).json({ translatedText: "Translation unavailable" });
  }
};

// ✅ NEW: AI Cooking Pro Tip Generator (LANGUAGE-AWARE)
export const getCookingTip = async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing text input for tip generation" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are an expert chef.
Based on the following cooking instruction, provide a short, practical pro tip in ${language || "English"}.

Guidelines:
- 1 to 2 sentences maximum.
- Focus on technique, safety, or flavor enhancement.
- Be friendly, concise, and natural.
- Avoid repeating the input text.

Cooking step:
"""
${text}
"""

Output:
Give only the pro tip text, no titles or extra commentary.
`;

    const result = await model.generateContent(prompt);
    const tip = result?.response?.text()?.trim() || "Tip unavailable";

    res.json({ tip });
  } catch (error) {
    console.error("❌ Cooking Tip API Error:", error.message || error);
    res.status(500).json({ error: "Failed to generate cooking tip" });
  }
};
