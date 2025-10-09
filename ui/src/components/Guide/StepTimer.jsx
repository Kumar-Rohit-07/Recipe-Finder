// src/components/Guide/StepTimer.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  startTimer,
  adjustTimer,
  calculateAdjustedTime,
} from "../../utils/timerLogic";
import TimerDisplay from "./Timerdisplay";

const flameColors = {
  Low: "bg-blue-500",
  Medium: "bg-orange-500",
  High: "bg-red-600",
};

const StepTimer = ({ baseTimeMinutes = 5, initialFlame = "Medium" }) => {
  const [flame, setFlame] = useState(initialFlame);
  const [remaining, setRemaining] = useState(
    calculateAdjustedTime(baseTimeMinutes, initialFlame)
  );
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // 🔊 Beep when timer ends
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch {
      console.warn("Beep not supported in this browser.");
    }
  };

  // 🕒 Auto-start or reset when step/time changes
  useEffect(() => {
    if (!baseTimeMinutes || baseTimeMinutes <= 0) {
      // no timer for this step
      if (intervalRef.current) intervalRef.current();
      setIsRunning(false);
      setRemaining(0);
      return;
    }

    // stop any old timer
    if (intervalRef.current) intervalRef.current();

    const initialTime = calculateAdjustedTime(baseTimeMinutes, flame);
    setRemaining(initialTime);
    setElapsed(0);
    setIsRunning(true);

    intervalRef.current = startTimer(
      initialTime,
      (r) => {
        setRemaining(r);
        setElapsed((prev) => prev + 1);
        if (r <= 0) {
          setIsRunning(false);
          playBeep();
          alert("⏰ Time’s up! Check your dish now.");
        }
      },
      () => {
        setIsRunning(false);
        playBeep();
        alert("⏰ Time’s up! Check your dish now.");
      }
    );

    return () => {
      if (intervalRef.current) intervalRef.current();
    };
  }, [baseTimeMinutes, flame]);

  // 🔥 Adjust flame dynamically
  const handleFlameChange = (newFlame) => {
    if (!isRunning || remaining <= 0) return;
    if (intervalRef.current) intervalRef.current();

    const newRemaining = adjustTimer(baseTimeMinutes, elapsed, newFlame);
    setFlame(newFlame);
    setRemaining(newRemaining);
    setIsRunning(true);

    intervalRef.current = startTimer(
      newRemaining,
      (r) => {
        setRemaining(r);
        setElapsed((prev) => prev + 1);
        if (r <= 0) {
          setIsRunning(false);
          playBeep();
          alert("⏰ Time’s up! Check your dish now.");
        }
      },
      () => {
        setIsRunning(false);
        playBeep();
        alert("⏰ Time’s up! Check your dish now.");
      }
    );
  };

  // Hide timer if no time required
  if (!baseTimeMinutes || baseTimeMinutes <= 0) return null;

  return (
    <div className="fixed top-0 right-0 z-50 max-w-md mx-auto p-4 bg-black text-white rounded-b-xl shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Cooking Timer ⏱️</h2>

        <div className="flex gap-2">
          {["Low", "Medium", "High"].map((level) => (
            <button
              key={level}
              onClick={() => handleFlameChange(level)}
              disabled={!isRunning || remaining <= 0}
              className={`px-3 py-1 text-sm rounded-lg font-semibold transition-all ${
                flame === level
                  ? `${flameColors[level]} scale-105`
                  : "bg-gray-700 hover:bg-gray-600"
              } ${
                !isRunning || remaining <= 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Timer Display */}
      <TimerDisplay remaining={remaining} />

      <p className="text-center text-sm text-gray-400 mt-2">
        Base time: {baseTimeMinutes} min | Flame: {flame}
      </p>

      {/* 💬 More visible disclaimer */}
      <p className="text-center text-xs italic text-cyan-400 mt-3">
        ⏱ Estimated time — check color, texture & aroma for doneness.
      </p>
    </div>
  );
};

export default StepTimer;
