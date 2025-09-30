import { motion } from "framer-motion";
import { Play, Pause, Square } from "lucide-react";
import { formatTime, calculateProgress } from "../../utils/timerUtils";
import { useAppStore } from "../../store/appStore";

function BreakTimer() {
  const { timeLeft, settings, isRunning, setIsRunning, setTimeLeft } =
    useAppStore();
  const radius = 75;
  const timerTickInterval = 1000; // ms
  const { strokeDasharray, strokeDashoffset } =
    timeLeft && settings.breakTime
      ? calculateProgress(timeLeft, settings.breakTime, radius)
      : { strokeDasharray: 0, strokeDashoffset: 0 };
  const displayTime = formatTime(timeLeft);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    setIsRunning(!isRunning);
  };

  const handleStop = (e) => {
    e.stopPropagation();
    setIsRunning(false);
    setTimeLeft(settings.breakTime);
  };

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
            r="70"
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
          <motion.circle
            cx="85"
            cy="85"
            r="70"
            stroke="#000000"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={
              isRunning ? "transition-all ease-linear" : "transition-none"
            }
            style={
              isRunning ? { transitionDuration: `${timerTickInterval}ms` } : {}
            }
            animate={isRunning ? { r: [70, 72, 70] } : { r: 70 } || { r: 70 }}
            transition={
              isRunning
                ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0 }
            }
          />
        </motion.svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-medium text-black mb-2 tracking-wider">
            {displayTime}
          </div>
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

export default BreakTimer;
