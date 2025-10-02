import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/appStore.ts";
import { formatTime } from "../utils/timerUtils.js";

function FloatingPillBox() {
  const {
    isPinned,
    isBreakMode,
    timeLeft,
    isRunning,
    setIsRunning,
    completedSessions,
    setTimeLeft,
    settings,
    setIsBreakMode,
    setCompletedSessions,
  } = useAppStore();

  const [showNotification, setShowNotification] = useState(false);

  // Show notification when break mode starts
  useEffect(() => {
    if (isBreakMode && completedSessions > 0) {
      setShowNotification(true);
      // Auto-hide notification after 3 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isBreakMode, completedSessions]);

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleRestart = () => {
    setIsRunning(false);
    if (isBreakMode) {
      setTimeLeft(settings.breakTime);
    } else {
      setTimeLeft(settings.pomodoroTime);
    }
  };

  const handleSkipBreak = () => {
    setIsBreakMode(false);
    setTimeLeft(settings.pomodoroTime);
    setIsRunning(false);
  };

  if (!isPinned) return null;

  return (
    <>
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">☕</span>
              <span className="font-medium">Time for a break!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        className="fixed top-4 left-4 z-40 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg px-4 py-2 flex items-center gap-3 min-w-[280px]"
      >
        {/* Left: Status Icon */}
        <div className="flex items-center gap-2">
          <div className="text-lg">{isBreakMode ? "☕" : "🍅"}</div>
          <div className="text-sm font-medium text-gray-700">
            {isBreakMode ? "Break" : "Focus"}
          </div>
        </div>

        {/* Center: Timer Display */}
        <div className="flex-1 text-center">
          <div className="text-lg font-mono font-bold text-gray-900">
            {formatTime(timeLeft)}
          </div>
          {completedSessions > 0 && (
            <div className="text-xs text-gray-500">
              Session: {completedSessions} started
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {!isBreakMode && (
            <button
              onClick={handlePause}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              title={isRunning ? "Pause" : "Resume"}
            >
              <span className="text-sm">{isRunning ? "⏸️" : "▶️"}</span>
            </button>
          )}

          <button
            onClick={handleRestart}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            title="Restart"
          >
            <span className="text-sm">🔄</span>
          </button>

          {isBreakMode && (
            <button
              onClick={handleSkipBreak}
              className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
              title="Skip Break"
            >
              <span className="text-sm">⏭️</span>
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default FloatingPillBox;
