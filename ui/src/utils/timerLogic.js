// utils/timerLogic.js

/**
 * Flame multipliers to adjust time.
 * - Low → slower cooking → more time
 * - Medium → normal
 * - High → faster cooking → less time
 */
const FLAME_MULTIPLIER = {
  Low: 1.3, // ~30% longer
  Medium: 1.0, // base
  High: 0.7, // ~30% faster
};

/**
 * Calculate adjusted remaining time when flame changes.
 * @param {number} baseTime - original estimated time in minutes (from AI)
 * @param {string} currentFlame - "Low" | "Medium" | "High"
 * @returns {number} adjusted time in seconds
 */
export function calculateAdjustedTime(baseTime, currentFlame) {
  const multiplier = FLAME_MULTIPLIER[currentFlame] || 1.0;
  return Math.round(baseTime * 60 * multiplier);
}

/**
 * Start a countdown timer with tick + complete callbacks.
 * Uses precise interval handling and auto-clear.
 * @param {number} duration - total seconds
 * @param {(remaining: number) => void} onTick - called every second
 * @param {() => void} onComplete - called when timer ends
 * @returns {() => void} stop function
 */
export function startTimer(duration, onTick, onComplete) {
  let remaining = duration;
  const startTime = Date.now();

  onTick(remaining);

  const interval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    remaining = Math.max(0, duration - elapsed);

    onTick(remaining);

    if (remaining <= 0) {
      clearInterval(interval);
      playBeep(); // 🔊 Beep when done
      onComplete && onComplete();
    }
  }, 1000);

  // Return stop function
  return () => clearInterval(interval);
}

/**
 * Adjust timer dynamically when flame level changes mid-way.
 * @param {number} baseTime - AI-estimated time (minutes)
 * @param {number} elapsedSeconds - elapsed time in seconds
 * @param {string} newFlame - "Low" | "Medium" | "High"
 * @returns {number} new remaining seconds
 */
export function adjustTimer(baseTime, elapsedSeconds, newFlame) {
  const totalForNewFlame = calculateAdjustedTime(baseTime, newFlame);
  const progressRatio = elapsedSeconds / (baseTime * 60);
  const remaining = totalForNewFlame * (1 - progressRatio);
  return Math.max(0, Math.round(remaining));
}

/**
 * Format seconds into mm:ss
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Play a short "beep" sound when timer finishes.
 */
export function playBeep() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // 880 Hz = pleasant beep
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.4); // short beep
  } catch (e) {
    console.warn("Beep not supported in this browser:", e);
  }
}
