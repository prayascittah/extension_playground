import { useEffect, useRef, useState, useCallback } from "react";
import { useAppStore } from "./store/appStore";
import { motion } from "framer-motion";
import {
  PinButton,
  LockButton,
  SettingsButton,
  TimerButton,
  BackButton,
} from "./components/common";
import { MiddleSection } from "./components/clock";
import { SettingsPage } from "./components/settings";
import { PomodoroTimer } from "./components/timer";
import BreakTimer from "./components/timer/BreakTimer";
import {
  handlePin,
  handleTimer,
  handleBack,
  handleSettings,
  handleLock,
  handleSettingsSave,
  handleSettingsClose,
  cleanupTimer,
} from "./utils/utils";

function App() {
  const [isBreakMode, setIsBreakMode] = useState(false);
  const {
    time,
    setTime,
    isLockInMode,
    isPinPinned,
    setIsPinPinned,
    isLockHovered,
    setIsLockHovered,
    setIsTimerHovered,
    isSettingsMode,
    setIsSettingsMode,
    settings,
    setSettings,
    isTimerMode,
    setIsTimerMode,
    timeLeft,
    setTimeLeft,
    isRunning,
    setIsRunning,
    setCompletedSessions,
  } = useAppStore();
  const timeoutRef = useRef();

  // Show back button in any non-clock mode
  const showBackButton = isTimerMode || isSettingsMode || isLockInMode;

  // Timer session transitions
  useEffect(() => {
    if (isTimerMode && timeLeft === 0 && !isRunning) {
      if (!isBreakMode) {
        setIsBreakMode(true);
        setTimeLeft(settings.breakTime);
        setIsRunning(false);
      } else {
        setIsBreakMode(false);
        setTimeLeft(settings.pomodoroTime);
        setIsRunning(false);
        setCompletedSessions((prev) => prev + 1);
      }
    }
  }, [
    timeLeft,
    isTimerMode,
    isBreakMode,
    isRunning,
    settings.breakTime,
    settings.pomodoroTime,
    setCompletedSessions,
    setTimeLeft,
    setIsRunning,
  ]);

  // Live clock
  useEffect(() => {
    const getTime = () => {
      const now = new Date();
      setTime(now);
      timeoutRef.current = setTimeout(getTime, 1000 - now.getMilliseconds());
    };
    getTime();
    return () => clearTimeout(timeoutRef.current);
  }, [setTime]);

  return (
    <div className="w-110 h-60 bg-gray-100 flex p-2">
      {/* Left section - Pin button and Back button */}
      <motion.div
        initial={{ x: -40, opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 130, mass: 1.5 }}
        className="flex flex-col items-center"
      >
        <PinButton />
        <BackButton />
      </motion.div>

      {/* Middle section - Clock, Timer, or Settings */}
      {isSettingsMode ? (
        <SettingsPage />
      ) : isTimerMode ? (
        isBreakMode ? (
          <BreakTimer />
        ) : (
          <PomodoroTimer />
        )
      ) : (
        <MiddleSection />
      )}

      {/* Right section - Lock, Timer, Settings buttons */}
      <motion.div
        initial={{ x: 40, opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 130, mass: 1.5 }}
        className="flex flex-col justify-center gap-2"
      >
        <LockButton />
        <TimerButton />
        <SettingsButton />
      </motion.div>
    </div>
  );
}

export default App;
