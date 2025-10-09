// services/aiService.js
import fetch from "node-fetch";

/**
 * aiService.analyzeStep(stepText, language)
 *
 * Returns:
 * {
 *   tip: string,
 *   estimatedTimeMinutes: number | null,
 *   flameLevel: 'Low' | 'Medium' | 'High' | null,
 *   raw: { fromAI?: any, heuristics?: {...} }  // optional debug info
 * }
 *
 * Behavior:
 *  - First runs a deterministic heuristic extractor (fast, reliable)
 *  - If GEMINI_API_KEY and GEMINI_API_URL present in env, attempts an optional AI call to improve the tip
 *  - Falls back gracefully if AI call fails or not configured
 */

// ---- Helper heuristics ----
function extractDurationMinutes(text) {
  if (!text) return null;
  const t = text.toLowerCase();

  // common patterns like "for 5 minutes", "5 mins", "for 1.5 minutes", "for 30-40 seconds"
  const minuteRegex = /(?:for|about|around|approximately)?\s*([0-9]+(?:[.,][0-9]+)?)\s*(?:minutes|minute|mins|min)\b/;
  const secondRegex = /(?:for|about|around|approximately)?\s*([0-9]+(?:[.,][0-9]+)?)\s*(?:seconds|second|secs|sec)\b/;
  const rangeMinutesRegex = /([0-9]+)\s*-\s*([0-9]+)\s*(?:minutes|mins|min)\b/;
  const rangeSecondsRegex = /([0-9]+)\s*-\s*([0-9]+)\s*(?:seconds|secs|sec)\b/;

  // ranges first
  let m = t.match(rangeMinutesRegex);
  if (m) {
    const a = parseFloat(m[1]), b = parseFloat(m[2]);
    return (a + b) / 2;
  }
  m = t.match(rangeSecondsRegex);
  if (m) {
    const a = parseFloat(m[1]), b = parseFloat(m[2]);
    return ((a + b) / 2) / 60;
  }

  // minutes
  m = t.match(minuteRegex);
  if (m) {
    // replace comma with dot if decimal
    return parseFloat(m[1].replace(",", "."));
  }

  // seconds -> convert to minutes
  m = t.match(secondRegex);
  if (m) {
    return parseFloat(m[1].replace(",", ".")) / 60;
  }

  // catch patterns like "boil 3-4 min" (short forms)
  m = t.match(/([0-9]+(?:[.,][0-9]+)?)\s*(?:m|min)\b/);
  if (m) return parseFloat(m[1].replace(",", "."));

  return null;
}

function extractFlameLevel(text) {
  if (!text) return null;
  const t = text.toLowerCase();

  // heuristics: map keywords to Low/Medium/High
  if (/\b(high heat|high flame|high)\b/.test(t) || /\boil\b/.test(t)) return "High";
  if (/\b(medium heat|medium flame|medium|moderate|rolling boil|gentle boil)\b/.test(t)) return "Medium";
  if (/\b(low heat|low flame|simmer|gentle|gentle simmer|very low)\b/.test(t)) return "Low";

  // phrases implying simmer -> Low
  if (/\bsimmer\b/.test(t)) return "Low";

  // if it mentions 'bring to a boil' -> High (to start) but sometimes then 'simmer' occurs.
  if (/\bbring( to)? a boil\b/.test(t)) return "High";

  // default null if uncertain
  return null;
}

function heuristicTipFromText(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  // very simple, helpful hints
  if (/\b(simmer|simmering)\b/.test(t)) return "Simmer gently; don't let it boil aggressively to preserve flavor.";
  if (/\b(boil|bring to a boil)\b/.test(t)) return "Bring to a rolling boil, then lower the flame as instructed.";
  if (/\b(fry|sauté|saute|fry until)\b/.test(t)) return "Use medium heat and keep stirring occasionally to avoid burning.";
  if (/\b(bake|roast)\b/.test(t)) return "Use appropriate oven temperature; oven times may vary.";
  // default neutral tip
  return "Times and heat are approximate — keep an eye on texture, color and aroma for best results.";
}

// ---- AI call (optional) ----
async function callGeminiForTip(stepText, language = "English") {
  // This function is optional. If you haven't set GEMINI_API_KEY or GEMINI_API_URL, we skip.
  // If you want Gemini support, in your .env set:
  // GEMINI_API_KEY=your_key
  // GEMINI_API_URL=https://your-gemini-endpoint.example.com/v1/generateText  (or whichever endpoint you use)
  //
  // The function expects GEMINI_API_URL to accept a POST with { prompt, maxTokens } and return JSON.
  // If your actual Gemini endpoint differs, update this function accordingly.
  const key = process.env.GEMINI_API_KEY;
  const url = process.env.GEMINI_API_URL;

  if (!key || !url) {
    return null;
  }

  // Construct a compact prompt asking for JSON only — keeps parsing simple
  const prompt = `Extract (if present) duration in minutes and a recommended flame level (Low, Medium, High) from the following cooking step.
Return ONLY a JSON object with keys: "estimated_time_minutes" (number or null), "flame_level" (one of "Low","Medium","High" or null), and "tip" (short string). 
Input: """${stepText}"""`;

  try {
    const payload = {
      prompt,
      // optional tuning parameters — depends on your Gemini wrapper
      maxTokens: 250,
      temperature: 0.2,
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.warn("aiService.callGeminiForTip non-OK:", resp.status, txt);
      return null;
    }

    const data = await resp.json();

    // expectation: the service returns a JSON text body; attempt to parse the model output
    // This block is tolerant: some Gemini wrappers return the generated text in different fields.
    let generated = null;
    if (data?.outputText) generated = data.outputText;
    else if (data?.result) generated = data.result;
    else if (data?.choices && Array.isArray(data.choices) && data.choices[0]?.text) generated = data.choices[0].text;
    else if (data?.candidates && Array.isArray(data.candidates) && data.candidates[0]?.content) generated = data.candidates[0].content;
    else {
      // attempt to stringify the whole response
      generated = JSON.stringify(data);
    }

    // try to find a JSON object inside the generated string
    const jsonMatch = generated.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        // normalize keys to our schema
        return {
          estimated_time_minutes: parsed.estimated_time_minutes ?? parsed.estimated_time ?? null,
          flame_level: parsed.flame_level ?? parsed.heat ?? null,
          tip: parsed.tip ?? parsed.advice ?? null,
          rawResponse: data,
        };
      } catch (e) {
        // fallthrough to return null below
        console.warn("aiService: failed to JSON.parse AI output", e);
        return { rawResponse: data, rawText: generated };
      }
    }

    // no JSON found — return raw text as tip
    return { estimated_time_minutes: null, flame_level: null, tip: generated, rawResponse: data };
  } catch (err) {
    console.error("aiService.callGeminiForTip error:", err);
    return null;
  }
}

// ---- Public function ----
export async function analyzeStep(stepText, language = "English") {
  // Basic heuristics
  const heuristics = {
    extractedMinutes: extractDurationMinutes(stepText),
    extractedFlame: extractFlameLevel(stepText),
    simpleTip: heuristicTipFromText(stepText),
  };

  // Build a base result
  const base = {
    tip: heuristics.simpleTip,
    estimatedTimeMinutes: heuristics.extractedMinutes,
    flameLevel: heuristics.extractedFlame,
    raw: { heuristics },
  };

  // Optionally try to get AI-enhanced output if configured
  try {
    const aiResult = await callGeminiForTip(stepText, language);

    if (aiResult) {
      // map aiResult fields into our result object (prefer AI when present)
      const finalTip = aiResult.tip || base.tip;
      const finalTime = (aiResult.estimated_time_minutes ?? aiResult.estimated_time_minutes) ?? base.estimatedTimeMinutes;
      const finalFlame = aiResult.flame_level || aiResult.flameLevel || base.flameLevel;

      return {
        tip: finalTip,
        estimatedTimeMinutes: typeof finalTime === "number" ? finalTime : base.estimatedTimeMinutes,
        flameLevel: finalFlame,
        raw: { heuristics, ai: aiResult },
      };
    }
  } catch (err) {
    // don't fail if AI call errors — return heuristics
    console.warn("aiService.analyzeStep: AI call failed, using heuristics", err);
  }

  return base;
}
