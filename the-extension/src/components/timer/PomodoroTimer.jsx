import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  formatTime,
  calculateProgress,
  createTimerInterval,
} from "../../utils/timerUtils";
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
  } = useAppStore();

  const radius = 75;
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = createTimerInterval(setTimeLeft, setIsRunning);
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
  }, [isRunning, setTimeLeft, setIsRunning]);

  const { strokeDasharray, strokeDashoffset } = calculateProgress(
    timeLeft,
    settings.pomodoroTime,
    radius
  );
  const displayTime = formatTime(timeLeft);

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
