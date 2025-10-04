// src/pages/Guide.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Guide = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [dish, setDish] = useState(null);
  const [language, setLanguage] = useState("english"); // default

  const languages = [
    { label: "English", value: "english" },
    { label: "Hindi", value: "hindi" },
    { label: "Spanish", value: "spanish" },
    { label: "French", value: "french" },
    { label: "German", value: "german" },
    { label: "Chinese", value: "chinese" },
    // Add more languages as needed
  ];

  // Fetch dish & initial English steps
  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/meals/meal/${id}`);
        const recipe = res.data;
        setDish(recipe);

        const rawSteps = recipe.procedure
          .split(/[\r\n]+|\. /)
          .map(s => s.trim())
          .filter(s => s.length > 0);

        const initialSteps = rawSteps.map(step => ({
          english: step,
          hindi: "अनुवाद उपलब्ध नहीं",
          spanish: "Traducción no disponible",
          french: "Traduction non disponible",
          german: "Übersetzung nicht verfügbar",
          chinese: "翻译不可用",
          details: "No extra details",
        }));

        setSteps(initialSteps);
      } catch (err) {
        setError("Failed to load recipe guide");
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [id]);

  // Translate steps when language changes
  useEffect(() => {
    if (language === "english" || steps.length === 0) return;

    const translateAllSteps = async () => {
      setTranslating(true);
      const updatedSteps = [];

      for (let step of steps) {
        try {
          const res = await axios.post(`http://localhost:5000/api/ai/translate-step`, {
            step: step.english,
            language,
          });
          updatedSteps.push({
            ...step,
            [language]: res.data.translatedText,
          });
        } catch (err) {
          updatedSteps.push({
            ...step,
            [language]: "अनुवाद उपलब्ध नहीं",
          });
        }
      }

      setSteps(updatedSteps);
      setTranslating(false);
    };

    translateAllSteps();
  }, [language]);

  if (loading) return <div className="text-center text-2xl mt-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-20">{error}</div>;
  if (!dish) return null;

  const stepData = steps[currentStep] || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-100 to-white flex flex-col items-center p-6">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-purple-800">
        {dish.name} - Cooking Guide
      </h1>

      {/* Language Selector */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-2 py-1 rounded border"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        {translating && <span className="ml-2 text-gray-600">Translating...</span>}
      </div>

      {/* Current Step */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Step {currentStep + 1}</h2>
        <p className="text-gray-900 font-medium">{stepData.english}</p>
        {language !== "english" && (
          <p className="text-purple-700 mt-2">{stepData[language]}</p>
        )}
        <p className="text-sm text-gray-500 mt-1 italic">{stepData.details}</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 0}
          className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${
            currentStep === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-600 text-white hover:bg-gray-700"
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

      {/* Progress Indicator */}
      <div className="mt-4 text-gray-600">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  );
};

export default Guide;
