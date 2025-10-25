import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StepTimer from "../components/Guide/StepTimer"; // ✅ Timer import

const Guide = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [loadingTip, setLoadingTip] = useState(false);
  const [error, setError] = useState(null);
  const [dish, setDish] = useState(null);
  const [aiTip, setAiTip] = useState("");
  const [language, setLanguage] = useState(
    localStorage.getItem("selectedLanguage") || "English"
  );

  const [timerData, setTimerData] = useState({
    estimated_time: null,
    flame_level: null,
  });

  const languages = [
    { label: "English", value: "English" },
    { label: "Hindi", value: "Hindi" },
    { label: "Spanish", value: "Spanish" },
    { label: "French", value: "French" },
    { label: "German", value: "German" },
    { label: "Chinese", value: "Chinese" },
  ];

  // ✅ Fetch recipe data
  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/meals/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const recipe = res.data;
        setDish(recipe);

        const rawSteps =
          recipe.procedureSteps && recipe.procedureSteps.length > 0
            ? recipe.procedureSteps
            : [recipe.procedure];

        const initialSteps = rawSteps.map((step) => ({ en: step }));
        setSteps(initialSteps);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe guide");
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [id]);

  // ✅ Translate current step
  useEffect(() => {
    if (language === "English" || steps.length === 0) return;

    const translateCurrentStep = async () => {
      const updatedSteps = [...steps];
      const current = updatedSteps[currentStep];
      if (current[language]) return;

      try {
        setTranslating(true);
        const res = await axios.post(
          "http://localhost:5000/api/translate/translate",
          {
            text: current.en,
            target: language,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        updatedSteps[currentStep][language] = res.data.translatedText;
        setSteps(updatedSteps);
      } catch (err) {
        console.error("Translation error:", err);
        updatedSteps[currentStep][language] = "Translation unavailable";
        setSteps(updatedSteps);
      } finally {
        setTranslating(false);
      }
    };
    translateCurrentStep();
  }, [language, currentStep, steps]);

  // ✅ Fetch AI Tip
  useEffect(() => {
    const fetchTip = async () => {
      const stepText = steps[currentStep]?.en?.trim();
      if (!stepText) return;

      try {
        setLoadingTip(true);
        const res = await axios.post(
          "http://localhost:5000/api/translate/tip",
          {
            text: stepText,
            language,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAiTip(res.data.tip || "Tip unavailable at the moment.");
      } catch {
        setAiTip("Tip unavailable at the moment.");
      } finally {
        setLoadingTip(false);
      }
    };
    fetchTip();
  }, [currentStep, steps, language]);

  // ✅ Fetch AI Timer + Flame for each step
  useEffect(() => {
    const analyzeStep = async () => {
      const stepText = steps[currentStep]?.en?.trim();
      if (!stepText) {
        setTimerData({ estimated_time: null, flame_level: null });
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:5000/api/timer/analyze-step",
          {
            stepText,
            language,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const timeValue = Number(res.data.estimated_time);
        setTimerData({
          estimated_time: !isNaN(timeValue) && timeValue > 0 ? timeValue : null,
          flame_level: res.data.flame_level || "Medium",
        });
      } catch (err) {
        console.error("Timer analysis error:", err);
        setTimerData({ estimated_time: null, flame_level: null });
      }
    };
    analyzeStep();
  }, [currentStep, language]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("selectedLanguage", lang);
  };

  if (loading)
    return <div className="text-center text-2xl mt-20">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-20">{error}</div>;
  if (!dish) return null;

  const stepData = steps[currentStep] || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-white flex flex-col items-center p-6 relative">
      {timerData.estimated_time !== null && (
        <div className="absolute top-0 right-0 z-50">
          <StepTimer
            baseTimeMinutes={timerData.estimated_time}
            initialFlame={timerData.flame_level}
            stepChanged={currentStep} // ✅ Add this prop
          />
        </div>
      )}


      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-purple-800 text-center">
        {dish.name} - Cooking Guide
      </h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold text-gray-800">
          Select Language:
        </label>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-2 py-1 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        {translating && (
          <span className="ml-2 text-gray-600 italic">Translating...</span>
        )}
      </div>

      <div className="w-full md:max-w-5xl lg:max-w-6xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Step {currentStep + 1}
        </h2>

        <p className="text-gray-800 font-medium leading-relaxed mb-4">
          {stepData.en}
        </p>

        {language !== "English" && (
          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm">
            <h3 className="text-indigo-800 font-semibold mb-2">
              Translation ({language})
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {stepData[language] || "Translation unavailable"}
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-orange-400 rounded-lg shadow-sm transition-all duration-300">
          <h3 className="text-orange-700 font-semibold mb-1">
            💡 SMART Cooking Tip
          </h3>
          {loadingTip ? (
            <p className="text-gray-500 italic">Generating tip...</p>
          ) : (
            <p className="text-gray-800 leading-relaxed italic">
              {aiTip || "Tip unavailable"}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 0}
          className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${
            currentStep === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
        >
          Prev
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold shadow-md hover:bg-orange-600 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => navigate(`/meal/${id}`)}
            className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 transition"
          >
            Finish
          </button>
        )}
      </div>

      <div className="mt-4 text-gray-700 font-medium">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  );
};

export default Guide;
