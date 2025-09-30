import { motion } from "framer-motion";
import { Play, Pause, Square } from "lucide-react";
import { formatTime, calculateProgress } from "../../utils/timerUtils";
import { useAppStore } from "../../store/appStore";
import BreakTimeCircle from "./BreakTimeCircle";
import BreakTimerDisplay from "./BreakTimerDisplay";
import BreakTimerControls from "./BreakTimerControls";

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
