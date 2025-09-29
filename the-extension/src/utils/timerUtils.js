// Timer utility functions
import { useEffect, useRef, useCallback } from "react";

export const useTimerLogic = (
  isRunning,
  timeLeft,
  totalTime,
  setTimeLeft,
  setIsRunning,
  isBreakMode,
  setCompletedSessions
) => {
  const timerRef = useRef(null);
  const interval = 1000; // ms

  // Manage ticking when isRunning is true. Use a single interval and
  // update state with a functional setState to avoid stale closures.
  useEffect(() => {
    // If not running, ensure any existing timer is cleared.
    if (!isRunning) {
      if (timerRef.current) {
        console.log("Timer stopped: clearing interval.");
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    console.log("Timer started: creating interval.");
    // Start the interval loop. This effect does NOT depend on `timeLeft`
    // so it won't recreate the interval every tick. The setter callback
    // uses the previous value to compute the next value.
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        console.log("Timer tick: previous timeLeft:", prev);
        if (prev <= 0) {
          console.log("Timer reached zero: stopping.");
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsRunning(false);
          return 0;
        }
        const next = Math.max(0, prev - interval);
        console.log("Timer tick: next timeLeft:", next);
        return next;
      });
    }, interval);

    return () => {
      if (timerRef.current) {
        console.log("Effect cleanup: clearing interval.");
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // Only restart when `isRunning` changes or when the setters change.
  }, [isRunning, setTimeLeft, setIsRunning]);

  const startTimer = useCallback(() => {
    // kept for API compatibility; starting is controlled externally by
    // setting `isRunning` in the store. This function is stable so
    // consumers can include it in deps without causing effect churn.
  }, []);

  const cleanupTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { startTimer, cleanupTimer };
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
