// Timer utility functions

export const useTimerLogic = (
  isRunning,
  timeLeft,
  totalTime,
  setTimeLeft,
  setIsRunning,
  isBreakMode,
  setCompletedSessions
) => {
  const timerRef = { current: null };
  const interval = 1000; // ms

  const startTimer = () => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(Math.max(0, timeLeft - interval));
      }, interval);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setTimeLeft(totalTime);
    }
  };

  const cleanupTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return { startTimer, cleanupTimer };
};

export const formatTime = (timeInSeconds) => {
  // Accept ms, convert to seconds
  const totalSeconds = Math.ceil(timeInSeconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const calculateProgress = (timeLeft, totalTime, radius) => {
  // Sync progress to displayed seconds for perfect alignment
  const displayedSeconds = Math.floor(timeLeft / 1000);
  const totalSeconds = Math.floor(totalTime / 1000);
  let progress;
  if (displayedSeconds > 0) {
    progress = ((totalSeconds - displayedSeconds) / totalSeconds) * 100;
  } else {
    progress = 100;
  }
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;
  return { progress, strokeDasharray, strokeDashoffset };
};
