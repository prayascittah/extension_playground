import { motion } from "framer-motion";
import { Play, Pause, Square } from "lucide-react";
import { formatTime, calculateProgress } from "../../utils/timerUtils";
import { useAppStore } from "../../store/appStore";

function PomodoroTimer() {
  const {
    timeLeft,
    settings,
    completedSessions,
    isRunning,
    setIsRunning,
    setTimeLeft,
  } = useAppStore();
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

  const handlePlayPause = (e) => {
    e.stopPropagation();
    setIsRunning(!isRunning);
  };

  const handleStop = (e) => {
    e.stopPropagation();
    setIsRunning(false);
    setTimeLeft(settings.pomodoroTime);
  };

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
        {/* Background circle with heartbeat animation */}
        <motion.svg
          width="170"
          height="170"
          className="transform -rotate-90"
          animate={isRunning ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={
            isRunning
              ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
        >
          <motion.circle
            cx="85"
            cy="85"
            r={70}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
            animate={isRunning ? { r: [70, 72, 70] } : { r: 70 }}
            transition={
              isRunning
                ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                : {}
            }
          />
          {/* Progress circle with heartbeat animation */}
          <motion.circle
            cx="85"
            cy="85"
            r={70}
            stroke="#000000"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-none"
            style={{}}
            animate={isRunning ? { r: [70, 72, 70] } : { r: 70 }}
            transition={
              isRunning
                ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0 }
            }
          />
        </motion.svg>

        {/* Timer display and controls - NO beating animation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-medium text-black mb-2 tracking-wider">
            {displayTime}
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors w-8 h-8 flex items-center justify-center"
            >
              {isRunning ? (
                <Pause size={16} className="text-black" />
              ) : (
                <Play size={16} className="text-black" />
              )}
            </button>

            <button
              onClick={handleStop}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors w-8 h-8 flex items-center justify-center"
            >
              <Square size={16} className="text-black" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PomodoroTimer;
