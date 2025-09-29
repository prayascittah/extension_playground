import { motion } from "framer-motion";
import { Lock } from "lucide-react";

function LockButton({ isPinned, isLockHovered, setIsLockHovered }) {
  return (
    <motion.button
      className={`p-2 rounded-md transition-colors w-8 h-8 flex items-center justify-center ${
        isPinned ? "bg-black" : "bg-gray-200 hover:bg-gray-300"
      }`}
      onMouseEnter={() => setIsLockHovered(true)}
      onMouseLeave={() => setIsLockHovered(false)}
      onClick={onLockClick}
      aria-label="Lock"
    >
      <Lock size={16} className={isPinned ? "text-white" : "text-black"} />
    </motion.button>
  );
}

export default LockButton;
