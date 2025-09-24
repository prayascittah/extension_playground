import { motion } from "framer-motion";
import TimeBox from "./TimeBox";
import SecondsBox from "./SecondsBox";

function ClockDisplay({ time }) {
  return (
    <motion.div
      className="flex items-center justify-start gap-4 relative"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 80,
        mass: 1,
        duration: 0.8,
      }}
    >
      {/* Hours Card */}
      <TimeBox value={time.getHours()} />

      {/* Minutes Card */}
      <div className="relative">
        <TimeBox value={time.getMinutes()} />
        <SecondsBox seconds={time.getSeconds()} />
      </div>
    </motion.div>
  );
}

export default ClockDisplay;
