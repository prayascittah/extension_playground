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
  toggleTimer,
  restartTimer,
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
    setIsLockInMode,
    isPinPinned,
    setIsPinPinned,
    isLockHovered,
    setIsLockHovered,
    isTimerHovered,
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
    completedSessions,
    setCompletedSessions,
  } = useAppStore();
  const totalTime = settings.pomodoroTime; // ms
  const timeoutRef = useRef();

  // Check if we should show the back button (any non-clock mode)
  const showBackButton = isTimerMode || isSettingsMode || isLockInMode;

  const memoizedRestartTimer = useCallback(() => {
    restartTimer(setIsRunning, isBreakMode, setTimeLeft, settings, totalTime);
  }, [setIsRunning, isBreakMode, setTimeLeft, settings, totalTime]);

  useEffect(() => {
    if (isTimerMode) {
      memoizedRestartTimer();
    } else {
      cleanupTimer(timeoutRef);
    }
    return () => cleanupTimer(timeoutRef);
  }, [isTimerMode, memoizedRestartTimer]);

  useEffect(() => {
    if (isTimerMode && timeLeft === 0 && isRunning === false) {
      if (!isBreakMode) {
        // Pomodoro session completed, start break
        setIsBreakMode(true);
        setTimeLeft(settings.breakTime);
        setIsRunning(false); // Don't auto-start break
      } else {
        // Break completed, start next Pomodoro
        setIsBreakMode(false);
        setTimeLeft(settings.pomodoroTime);
        setIsRunning(false); // Don't auto-start next session
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

  useEffect(() => {
    const getTime = () => {
      const now = new Date();
      setTime(now);
      timeoutRef.current = setTimeout(getTime, 1000 - now.getMilliseconds());
    };
    getTime();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Regular popup mode
  return (
    <div className="w-110 h-60 bg-gray-100 flex p-2">
      {/* Left section - Pin button and Back button sliding from left */}
      <motion.div
        initial={{ x: -40, opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 130,
          mass: 1.5,
        }}
        className="flex flex-col items-center"
      >
        <PinButton
          isPinPinned={isPinPinned}
          onClick={() => handlePin(setIsPinPinned, isPinPinned)}
        />
        <BackButton
          onClick={() => handleBack(setIsTimerMode, setIsSettingsMode)}
          isVisible={showBackButton}
        />
      </motion.div>

      {/* Middle section - Clock display, Pomodoro Timer, or Settings */}
      {isSettingsMode ? (
        <SettingsPage
          currentSettings={settings}
          onSave={(newSettings) =>
            handleSettingsSave(
              setSettings,
              newSettings,
              setTimeLeft,
              setIsSettingsMode,
              setIsTimerMode
            )
          }
          onClose={() => handleSettingsClose(setIsSettingsMode)}
        />
      ) : isTimerMode ? (
        isBreakMode ? (
          <BreakTimer
            timeLeft={timeLeft}
            totalTime={settings.breakTime}
            isRunning={isRunning}
            onToggleTimer={() => toggleTimer(setIsRunning, isRunning)}
            onRestartTimer={() =>
              restartTimer(
                setIsRunning,
                isBreakMode,
                setTimeLeft,
                settings,
                totalTime
              )
            }
          />
        ) : (
          <PomodoroTimer
            timeLeft={timeLeft}
            totalTime={totalTime}
            completedSessions={completedSessions}
            isRunning={isRunning}
            onToggleTimer={() => toggleTimer(setIsRunning, isRunning)}
            onRestartTimer={() =>
              restartTimer(
                setIsRunning,
                isBreakMode,
                setTimeLeft,
                settings,
                totalTime
              )
            }
          />
        )
      ) : (
        <MiddleSection time={time} />
      )}

      {/* Right section - Buttons sliding from right */}
      <motion.div
        initial={{ x: 40, opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 130,
          mass: 1.5,
        }}
        className="flex flex-col justify-center gap-2"
      >
        <LockButton
          isPinned={isLockInMode}
          isLockHovered={isLockHovered}
          setIsLockHovered={setIsLockHovered}
          onLockClick={handleLock}
        />
        <TimerButton
          setIsTimerHovered={setIsTimerHovered}
          onTimerClick={() =>
            handleTimer(
              setIsSettingsMode,
              setIsTimerMode,
              isTimerMode,
              setTimeLeft,
              totalTime,
              setIsRunning,
              setIsBreakMode
            )
          }
          isTimerMode={isTimerMode}
        />
        <SettingsButton
          onSettingsClick={() =>
            handleSettings(setIsTimerMode, setIsSettingsMode, isSettingsMode)
          }
          isSettingsMode={isSettingsMode}
        />
      </motion.div>
    </div>
  );
}

export default App;
