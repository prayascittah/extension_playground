// Timer utility functions

export const formatTime = (timeInMs) => {
  if (timeInMs == null || timeInMs < 0 || isNaN(timeInMs)) return "00:00";

  const totalSeconds = Math.ceil(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const calculateProgress = (timeLeft, totalTime, radius) => {
  const progress = Math.max(
    0,
    Math.min(100, ((totalTime - timeLeft) / totalTime) * 100)
  );
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;

  return { strokeDasharray, strokeDashoffset };
};
