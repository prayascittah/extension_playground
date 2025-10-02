import { motion } from "framer-motion";
import { calculateProgress } from "../../utils/timerUtils";
import { useAppStore } from "../../store/appStore.ts";

function PomodoroTimerCircle() {
  const { timeLeft, settings } = useAppStore();
  const radius = 70;
  const { strokeDasharray, strokeDashoffset } = calculateProgress(
    timeLeft,
    settings.pomodoroTime,
    radius
  );
  const { isRunning } = useAppStore();

  return (
    <motion.svg
      width="170"
      height="170"
      className="transform -rotate-90"
      animate={isRunning ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={
        isRunning ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}
      }
    >
      <circle
        cx="85"
        cy="85"
        r={radius}
        stroke="#e5e7eb"
        strokeWidth="8"
        fill="transparent"
      />
      <motion.circle
        cx="85"
        cy="85"
        r={radius}
        stroke="#000000"
        strokeWidth="8"
        fill="transparent"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-300 ease-out"
      />
    </motion.svg>
  );
}

export default PomodoroTimerCircle;
