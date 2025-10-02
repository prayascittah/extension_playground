import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { formatTime, calculateProgress } from "../../utils/timerUtils";
import { useAppStore } from "../../store/appStore";
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

  const radius = 70;
  const timerRef = useRef(null);

  // Initialize timeLeft if it's invalid
  useEffect(() => {
    if (timeLeft == null || isNaN(timeLeft) || timeLeft < 0) {
      console.log(
        "Initializing timeLeft to pomodoroTime:",
        settings.pomodoroTime
      );
      setTimeLeft(settings.pomodoroTime);
    }
  }, [timeLeft, settings.pomodoroTime, setTimeLeft]);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = Math.max(0, prev - 1000);
          console.log("Timer tick:", newTime);

          // Handle timer completion
          if (newTime === 0) {
            setIsRunning(false);

            // Transition between pomodoro and break
            if (!isBreakMode) {
              // Completed a pomodoro session, start break
              setIsBreakMode(true);
              setTimeLeft(settings.breakTime);
              setCompletedSessions((prev) => prev + 1);
            } else {
              // Completed break, back to pomodoro
              setIsBreakMode(false);
              setTimeLeft(settings.pomodoroTime);
            }
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
    isBreakMode,
    settings.breakTime,
    settings.pomodoroTime,
    setTimeLeft,
    setIsRunning,
    setIsBreakMode,
    setCompletedSessions,
  ]);

  const { strokeDasharray, strokeDashoffset } = calculateProgress(
    timeLeft,
    settings.pomodoroTime,
    radius
  );
  const displayTime = formatTime(timeLeft);

  // Debug logging
  console.log(
    "PomodoroTimer - timeLeft:",
    timeLeft,
    "settings.pomodoroTime:",
    settings.pomodoroTime,
    "displayTime:",
    displayTime
  );

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
        <PomodoroTimerCircle
          isRunning={isRunning}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <PomodoroTimerDisplay displayTime={displayTime} />
          {/* Control buttons */}
          <PomodoroTimerControls />
        </div>
      </motion.div>
    </div>
  );
}

export default PomodoroTimer;
