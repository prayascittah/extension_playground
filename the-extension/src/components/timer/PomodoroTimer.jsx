import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../../store/appStore.ts";
import PomodoroTimerCircle from "./PomodoroTimerCircle";
import PomodoroTimerDisplay from "./PomodoroTimerDisplay";
import PomodoroTimerControls from "./PomodoroTimerControls";

function PomodoroTimer() {
  const { timeLeft, isRunning, completedSessions, syncWithBackground } =
    useAppStore();

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
      {/* Session counter on the left - slides in from left */}
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
        Focus sessions: {completedSessions}
        <br />
        <span className="italic">stay focused</span>
      </motion.div>

      {/* Main timer circle - scales up */}
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
        <PomodoroTimerCircle />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <PomodoroTimerDisplay />
          <PomodoroTimerControls />
        </div>
      </motion.div>
    </div>
  );
}

export default PomodoroTimer;
