import { motion } from "framer-motion";

function DateHeader({ time }) {
  return (
    <motion.div
      className="text-gray-700 text-base font-bold text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.9,
        ease: "easeOut",
        delay: 0.2,
      }}
    >
      {time.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })}
    </motion.div>
  );
}

export default DateHeader;
