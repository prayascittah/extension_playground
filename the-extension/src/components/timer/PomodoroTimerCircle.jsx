import { motion } from "framer-motion";

function PomodoroTimerCircle({
  isRunning,
  strokeDasharray = 0,
  strokeDashoffset = 0,
}) {
  const radius = 70;

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
