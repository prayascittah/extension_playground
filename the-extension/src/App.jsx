import { useEffect, useRef, useState } from "react";
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
import { useTimerLogic } from "./utils/timerUtils";

function App() {
  const [isBreakMode, setIsBreakMode] = useState(false);
  const {
    time,
    setTime,
    isPinned,
    setIsPinned,
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

  // Use timer utility logic for both Pomodoro and break
  const { startTimer, cleanupTimer } = useTimerLogic(
    isRunning,
    timeLeft,
    isBreakMode ? settings.breakTime : totalTime,
    setTimeLeft,
    setIsRunning,
    isBreakMode,
    setCompletedSessions
  );

  const handlePin = () => {
    setIsPinPinned(!isPinPinned);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "toggleFloatingClock" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.log("Content script not ready, that's okay");
          }
        }
      );
    });
  };

  const handleTimer = () => {
    setIsSettingsMode(false);
    setIsTimerMode(!isTimerMode);
    if (!isTimerMode) {
      setTimeLeft(totalTime);
      setIsRunning(false);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const restartTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const handleBack = () => {
    setIsTimerMode(false);
    setIsSettingsMode(false);
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const handleSettings = () => {
    setIsTimerMode(false);
    setIsSettingsMode(!isSettingsMode);
  };

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    const newTotalTime = newSettings.pomodoroTime;
    setTimeLeft(newTotalTime);
    setIsSettingsMode(false);
    setIsTimerMode(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsMode(false);
  };

  // Check if we should show the back button (any non-clock mode)
  const showBackButton = isTimerMode || isSettingsMode || isPinned;

  useEffect(() => {
    startTimer();
    return cleanupTimer;
  }, [
    isTimerMode,
    isRunning,
    timeLeft,
    totalTime,
    isBreakMode,
    settings.breakTime,
  ]);

  useEffect(() => {
    if (isTimerMode && timeLeft === 0 && !isBreakMode) {
      setIsBreakMode(true);
      setTimeLeft(settings.breakTime);
      setIsRunning(true); // Start break timer immediately
    } else if (isBreakMode && timeLeft === 0) {
      setIsBreakMode(false);
      setTimeLeft(settings.pomodoroTime);
      setIsRunning(true); // Start next Pomodoro automatically
      setCompletedSessions((prev) => prev + 1);
    }
  }, [
    timeLeft,
    isTimerMode,
    isBreakMode,
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
        <PinButton isPinPinned={isPinPinned} onPinClick={handlePin} />
        <BackButton onBackClick={handleBack} isVisible={showBackButton} />
      </motion.div>

      {/* Middle section - Clock display, Pomodoro Timer, or Settings */}
      {isSettingsMode ? (
        <SettingsPage
          currentSettings={settings}
          onSave={handleSettingsSave}
          onClose={handleSettingsClose}
        />
      ) : isTimerMode ? (
        isBreakMode ? (
          <BreakTimer
            timeLeft={timeLeft}
            totalTime={settings.breakTime}
            isRunning={isRunning}
            onToggleTimer={toggleTimer}
            onRestartTimer={restartTimer}
          />
        ) : (
          <PomodoroTimer
            timeLeft={timeLeft}
            totalTime={totalTime}
            completedSessions={completedSessions}
            isRunning={isRunning}
            onToggleTimer={toggleTimer}
            onRestartTimer={restartTimer}
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
          isPinned={isPinned}
          isLockHovered={isLockHovered}
          setIsLockHovered={setIsLockHovered}
        />
        <TimerButton
          isTimerHovered={isTimerHovered}
          setIsTimerHovered={setIsTimerHovered}
          onTimerClick={handleTimer}
          isTimerMode={isTimerMode}
        />
        <SettingsButton
          onSettingsClick={handleSettings}
          isSettingsMode={isSettingsMode}
        />
      </motion.div>
    </div>
  );
}

export default App;
