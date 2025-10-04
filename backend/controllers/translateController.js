// controllers/translateController.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const translateText = async (req, res) => {
  try {
    const { text, target } = req.body;

    if (!text || !target) {
      return res.status(400).json({ error: "Text and target language are required" });
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
        q: text,
        target: target
      },
    };

    const response = await axios.request(options);

    // response.data.data.translations[0].translatedText contains translated text
    const translatedText = response.data.data.translations[0].translatedText;

    res.json({ translatedText });
  } catch (error) {
    console.error("Translation API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to translate text" });
  }
};
