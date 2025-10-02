import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../../store/appStore.ts";
import BreakTimeCircle from "./BreakTimeCircle";
import BreakTimerDisplay from "./BreakTimerDisplay";
import BreakTimerControls from "./BreakTimerControls";

function BreakTimer() {
  const { timeLeft, isRunning, syncWithBackground } = useAppStore();

  useEffect(() => {
    // Only try Chrome APIs if in extension context
    if (typeof chrome !== "undefined" && chrome.runtime) {
      // Request initial timer state from background
      chrome.runtime.sendMessage({ action: "getTimerState" }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("Background script not ready yet");
          return;
        }
        if (response && response.timerState) {
          syncWithBackground(response.timerState);
        }
      });

      // Listen for timer updates from background
      function handleMessage(message) {
        if (message.action === "updateTimerState" && message.timerState) {
          syncWithBackground(message.timerState);
        }
      }
      chrome.runtime.onMessage.addListener(handleMessage);
      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage);
      };
    }
  }, [syncWithBackground]);

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
        <BreakTimeCircle />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <BreakTimerDisplay />
          <BreakTimerControls />
        </div>
      </motion.div>
    </div>
  );
}

export default BreakTimer;
