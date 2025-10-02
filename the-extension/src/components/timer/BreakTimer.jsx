import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../../store/appStore.ts";
import BreakTimeCircle from "./BreakTimeCircle";
import BreakTimerDisplay from "./BreakTimerDisplay";
import BreakTimerControls from "./BreakTimerControls";

function BreakTimer() {
  const {
    timeLeft,
    settings,
    isRunning,
    setIsRunning,
    setTimeLeft,
    isBreakMode,
    setIsBreakMode,
  } = useAppStore();
  const timerRef = useRef(null);

  // Automatic timer start when in break mode
  useEffect(() => {
    if (isBreakMode && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        const newTime = Math.max(0, timeLeft - 1000);

        // Handle timer completion
        if (newTime === 0) {
          setIsRunning(false);
          // Break completed, back to pomodoro
          setIsBreakMode(false);
          setTimeLeft(settings.pomodoroTime);
        } else {
          setTimeLeft(newTime); // Update timeLeft
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    isBreakMode,
    timeLeft,
    settings.pomodoroTime,
    setTimeLeft,
    setIsRunning,
    setIsBreakMode,
  ]);

  return (
    <div className="flex-1 flex items-center justify-start gap-10">
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
        Break time!
        <br />
        <span className="italic">relax</span>
      </motion.div>
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
        <BreakTimeCircle />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <BreakTimerDisplay />
          <BreakTimerControls />
        </div>
      </motion.div>
    </div>
  );
}

export default BreakTimer;
