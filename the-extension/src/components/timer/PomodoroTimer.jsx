import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../../store/appStore.ts";
import PomodoroTimerCircle from "./PomodoroTimerCircle";
import PomodoroTimerDisplay from "./PomodoroTimerDisplay";
import PomodoroTimerControls from "./PomodoroTimerControls";

function PomodoroTimer() {
  const {
    timeLeft,
    settings,
    completedSessions,
    isRunning,
    setTimeLeft,
    setIsRunning,
    isBreakMode,
    setIsBreakMode,
    setCompletedSessions,
  } = useAppStore();

  const timerRef = useRef(null);

  // Timer countdown effect
  useEffect(() => {
    console.log(isRunning, timeLeft);
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        const newTime = Math.max(0, timeLeft - 1000);
        if (newTime === 0) {
          setIsRunning(false);
          setIsBreakMode(true);
          setTimeLeft(settings.breakTime);
        } else {
          setTimeLeft(newTime);
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    isRunning,
    timeLeft,
    isBreakMode,
    settings.breakTime,
    settings.pomodoroTime,
    setTimeLeft,
    setIsRunning,
    setIsBreakMode,
    setCompletedSessions,
  ]);
  return (
    <div className="flex-1 flex items-center justify-start gap-10">
      {/* Session counter on the left - slides in from left */}
      <motion.div
        className="text-xs text-gray-500 text-center"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 110,
          mass: 1.5,
          delay: 0.2,
        }}
      >
        Focus sessions: {completedSessions}
        <br />
        <span className="italic">stay focused</span>
      </motion.div>

      {/* Main timer circle - scales up */}
      <motion.div
        className="relative"
        initial={{ scale: 0.3 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 80,
          mass: 1,
          duration: 0.8,
        }}
      >
        <PomodoroTimerCircle />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <PomodoroTimerDisplay />
          <PomodoroTimerControls />
        </div>
      </motion.div>
    </div>
  );
}

export default PomodoroTimer;
