import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "../../store/appStore.ts";
import { handleBack } from "../../utils/utils";

function BackButton() {
  const {
    isTimerMode,
    isSettingsMode,
    isLockInMode,
    setIsTimerMode,
    setIsSettingsMode,
  } = useAppStore();
  const isVisible = isTimerMode || isSettingsMode || isLockInMode;
  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 130,
        mass: 1.5,
      }}
      onClick={() => handleBack(setIsTimerMode, setIsSettingsMode)}
      className="p-2 bg-gray-200 hover:bg-gray-30 rounded-lg flex items-center justify-center"
      title="Back to clock"
    >
      <ArrowLeft size={16} className="text-black" />
    </motion.button>
  );
}

export default BackButton;
