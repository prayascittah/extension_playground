import { useAppStore } from "../store/appStore";

// Utility for timer session transitions
export function handleSessionTransition() {
  const {
    isTimerMode,
    timeLeft,
    isRunning,
    isBreakMode,
    setIsBreakMode,
    setTimeLeft,
    setIsRunning,
    setCompletedSessions,
    settings,
  } = useAppStore.getState();

  if (isTimerMode && timeLeft === 0 && !isRunning) {
    if (!isBreakMode) {
      setIsBreakMode(true);
      setTimeLeft(settings.breakTime);
      setIsRunning(false);
    } else {
      setIsBreakMode(false);
      setTimeLeft(settings.pomodoroTime);
      setIsRunning(false);
      setCompletedSessions((prev) => prev + 1);
    }
  }
}

export function useLiveClock(timeoutRef) {
  const { setTime } = useAppStore();
  // Live clock effect
  return () => {
    const getTime = () => {
      const now = new Date();
      setTime(now);
      timeoutRef.current = setTimeout(getTime, 1000 - now.getMilliseconds());
    };
    getTime();
    return () => clearTimeout(timeoutRef.current);
  };
}
