// Timer utility functions

export const useTimerLogic = (
  isTimerMode,
  isRunning,
  timeLeft,
  totalTime,
  setTimeLeft,
  setIsRunning,
  setCompletedSessions
) => {
  const timerRef = { current: null };

  const startTimer = () => {
    if (isTimerMode && isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer completed
      setIsRunning(false);
      setCompletedSessions((prev) => prev + 1);
      setTimeLeft(totalTime); // Reset for next session
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
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const calculateProgress = (timeLeft, totalTime, radius) => {
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;
  return { progress, strokeDasharray, strokeDashoffset };
};
