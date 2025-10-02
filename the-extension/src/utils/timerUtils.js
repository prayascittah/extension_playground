// Timer utility functions

// Simple timer tick function - no hooks, just plain logic
export const createTimerInterval = (setTimeLeft, setIsRunning) => {
  return setInterval(() => {
    setTimeLeft((prev) => {
      console.log("Timer tick:", prev);
      if (prev <= 0) {
        setIsRunning(false);
        return 0;
      }
      return Math.max(0, prev - 1000);
    });
  }, 1000);
};

export const formatTime = (timeInMs) => {
  // Accept ms, convert to seconds
  const totalSeconds = Math.ceil(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const calculateProgress = (timeLeft, totalTime, radius) => {
  // Ensure all values are valid numbers
  const safeTimeLeft =
    typeof timeLeft === "number" && !isNaN(timeLeft) ? timeLeft : 0;
  const safeTotalTime =
    typeof totalTime === "number" && !isNaN(totalTime) ? totalTime : 60000;
  const safeRadius = typeof radius === "number" && !isNaN(radius) ? radius : 75;

  // Sync progress to displayed seconds for perfect alignment
  const displayedSeconds = Math.floor(safeTimeLeft / 1000);
  const totalSeconds = Math.floor(safeTotalTime / 1000);
  let progress;
  if (displayedSeconds > 0) {
    progress = ((totalSeconds - displayedSeconds) / totalSeconds) * 100;
  } else {
    progress = 100;
  }
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;
  const strokeDasharray = 2 * Math.PI * safeRadius;
  const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;
  return { progress, strokeDasharray, strokeDashoffset };
};
