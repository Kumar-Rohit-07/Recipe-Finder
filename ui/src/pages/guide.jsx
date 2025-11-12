import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StepTimer from "../components/Guide/StepTimer";

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

  // ✅ Translate step
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
      } catch {
        updatedSteps[currentStep][language] = "Translation unavailable";
        setSteps(updatedSteps);
      } finally {
        setTranslating(false);
      }
    };
    translateCurrentStep();
  }, [language, currentStep, steps]);

  // ✅ AI Tip
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

  // ✅ Timer
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
          { stepText, language },
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
      } catch {
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-white flex flex-col items-center p-4 sm:p-6 relative">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 text-black text-2xl sm:text-3xl bg-white/60 hover:bg-black/10 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-2 rounded-full transition shadow-md"
      >
        ←
      </button>

      {/* Timer (Mobile moves below header) */}
      {timerData.estimated_time !== null && (
        <div className="absolute top-14 sm:top-0 right-4 sm:right-0 z-40 scale-90 sm:scale-100">
          <StepTimer
            baseTimeMinutes={timerData.estimated_time}
            initialFlame={timerData.flame_level}
            stepChanged={currentStep}
          />
        </div>
      )}

      <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-purple-800 text-center mt-14 sm:mt-10 leading-tight px-4">
        {dish.name} - Cooking Guide
      </h1>

      {/* Language Selector */}
      <div className="mb-4 text-sm sm:text-base flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <label className="font-semibold text-gray-800">
          Select Language:
        </label>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-2 py-1 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        {translating && (
          <span className="text-gray-600 italic text-xs sm:text-sm">
            Translating...
          </span>
        )}
      </div>

      {/* Step Card */}
      <div className="w-full max-w-3xl sm:max-w-5xl bg-white rounded-2xl shadow-lg p-5 sm:p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
          Step {currentStep + 1}
        </h2>

        <p className="text-gray-800 font-medium leading-relaxed mb-4 text-sm sm:text-base">
          {stepData.en}
        </p>

        {language !== "English" && (
          <div className="mt-4 p-3 sm:p-4 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm">
            <h3 className="text-indigo-800 font-semibold mb-2 text-sm sm:text-base">
              Translation ({language})
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {stepData[language] || "Translation unavailable"}
            </p>
          </div>
        )}

        {/* AI Tip */}
        <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border-l-4 border-orange-400 rounded-lg shadow-sm">
          <h3 className="text-orange-700 font-semibold mb-1 text-sm sm:text-base">
            💡 SMART Cooking Tip
          </h3>
          {loadingTip ? (
            <p className="text-gray-500 italic text-sm sm:text-base">
              Generating tip...
            </p>
          ) : (
            <p className="text-gray-800 leading-relaxed italic text-sm sm:text-base">
              {aiTip || "Tip unavailable"}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 w-full max-w-md justify-center">
        <button
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 0}
          className={`px-6 py-2 rounded-lg font-semibold shadow-md transition text-sm sm:text-base ${
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
            className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold shadow-md hover:bg-orange-600 transition text-sm sm:text-base"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => navigate(`/meal/${id}`)}
            className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 transition text-sm sm:text-base"
          >
            Finish
          </button>
        )}
      </div>

      <div className="mt-4 text-gray-700 font-medium text-sm sm:text-base">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  );
};

export default Guide;
