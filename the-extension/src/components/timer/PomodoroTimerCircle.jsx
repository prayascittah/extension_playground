import { motion } from "framer-motion";

function PomodoroTimerCircle({ isRunning, strokeDasharray, strokeDashoffset }) {
  // Ensure all props are valid numbers to prevent SVG errors
  const safeStrokeDasharray =
    typeof strokeDasharray === "number" && !isNaN(strokeDasharray)
      ? strokeDasharray
      : 440;
  const safeStrokeDashoffset =
    typeof strokeDashoffset === "number" && !isNaN(strokeDashoffset)
      ? strokeDashoffset
      : 0;
  const safeIsRunning = Boolean(isRunning);

  return (
    <motion.svg
      width="170"
      height="170"
      className="transform -rotate-90"
      animate={safeIsRunning ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={
        safeIsRunning
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
        animate={safeIsRunning ? { r: [70, 72, 70] } : { r: 70 }}
        transition={
          safeIsRunning
            ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
      />
      <motion.circle
        cx="85"
        cy="85"
        r={70}
        stroke="#000000"
        strokeWidth="8"
        fill="transparent"
        strokeDasharray={safeStrokeDasharray}
        strokeDashoffset={safeStrokeDashoffset}
        strokeLinecap="round"
        className="transition-none"
        animate={safeIsRunning ? { r: [70, 72, 70] } : { r: 70 }}
        transition={
          safeIsRunning
            ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }
        }
      />
    </motion.svg>
  );
}

export default PomodoroTimerCircle;
