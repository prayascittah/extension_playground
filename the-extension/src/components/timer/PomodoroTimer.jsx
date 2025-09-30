import { motion } from "framer-motion";
import { formatTime, calculateProgress } from "../../utils/timerUtils";
import { useAppStore } from "../../store/appStore";
import PomodoroTimerCircle from "./PomodoroTimerCircle";
import PomodoroTimerDisplay from "./PomodoroTimerDisplay";
import PomodoroTimerControls from "./PomodoroTimerControls";

function PomodoroTimer() {
  const { timeLeft, settings, completedSessions, isRunning } = useAppStore();
  const radius = 75;

  // Ensure timeLeft and settings.pomodoroTime are always valid numbers
  const safeTimeLeft =
    typeof timeLeft === "number" ? timeLeft : settings.pomodoroTime;
  const safePomodoroTime =
    typeof settings.pomodoroTime === "number" ? settings.pomodoroTime : 60000;
  const { strokeDasharray, strokeDashoffset } = calculateProgress(
    safeTimeLeft,
    safePomodoroTime,
    radius
  );
  const displayTime = formatTime(safeTimeLeft);

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
