import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { formatTime, calculateProgress } from "../../utils/timerUtils";
import { useAppStore } from "../../store/appStore";
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

  const radius = 70;
  const timerRef = useRef(null);

  // Initialize timeLeft if it's invalid
  useEffect(() => {
    if (timeLeft == null || isNaN(timeLeft) || timeLeft < 0) {
      console.log(
        "Initializing break timeLeft to breakTime:",
        settings.breakTime
      );
      setTimeLeft(settings.breakTime);
    }
  }, [timeLeft, settings.breakTime, setTimeLeft]);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = Math.max(0, prev - 1000);
          console.log("Break timer tick:", newTime);

          // Handle timer completion
          if (newTime === 0) {
            setIsRunning(false);
            // Break completed, back to pomodoro
            setIsBreakMode(false);
            setTimeLeft(settings.pomodoroTime);
          }

          return newTime;
        });
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
    isRunning,
    timeLeft,
    settings.pomodoroTime,
    setTimeLeft,
    setIsRunning,
    setIsBreakMode,
  ]);

  const { strokeDasharray, strokeDashoffset } = calculateProgress(
    timeLeft,
    settings.breakTime,
    radius
  );
  const displayTime = formatTime(timeLeft);

  // Debug logging
  console.log(
    "BreakTimer - timeLeft:",
    timeLeft,
    "settings.breakTime:",
    settings.breakTime,
    "displayTime:",
    displayTime
  );

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
        <BreakTimeCircle
          isRunning={isRunning}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <BreakTimerDisplay displayTime={displayTime} />
          <BreakTimerControls />
        </div>
      </motion.div>
    </div>
  );
}

export default BreakTimer;
