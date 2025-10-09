// controllers/timerController.js
import { analyzeStep as analyzeCookingStep } from "../services/aiService.js";

export const analyzeStep = async (req, res) => {
  try {
    const { stepText, language } = req.body || {};

    if (!stepText || typeof stepText !== "string") {
      return res.status(400).json({ message: "stepText (string) is required in request body" });
    }

    // call service to analyze (returns { tip, estimatedTimeMinutes, flameLevel, raw } )
    const result = await analyzeCookingStep(stepText, language || "English");

    // normalize response shape for frontend
    return res.json({
      tip: result.tip || null,
      estimated_time: result.estimatedTimeMinutes || null, // number in minutes (can be float)
      flame_level: result.flameLevel || null, // 'Low' | 'Medium' | 'High' | null
      raw: result.raw || null, // raw debug info (optional)
    });
  } catch (err) {
    console.error("timerController.analyzeStep error:", err);
    return res.status(500).json({ message: "Failed to analyze step" });
  }
};
