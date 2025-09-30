import { motion } from "framer-motion";

function PomodoroTimerCircle({ isRunning, strokeDasharray, strokeDashoffset }) {
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
  );
}

export default PomodoroTimerCircle;
