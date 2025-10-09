// src/components/Guide/TimerDisplay.jsx
import React from "react";
import { formatTime } from "../../utils/timerLogic";

const TimerDisplay = ({ remaining }) => {
  const timeColor =
    remaining <= 10
      ? "text-red-500 animate-pulse"
      : remaining <= 30
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div
        className={`text-4xl font-bold transition-all duration-500 ease-in-out ${timeColor}`}
      >
        {formatTime(remaining)}
      </div>
      <p className="text-sm text-gray-400 mt-1">Remaining Time</p>
    </div>
  );
};

export default TimerDisplay;
