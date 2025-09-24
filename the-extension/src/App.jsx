import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  PinButton,
  LockButton,
  SettingsButton,
  TimerButton,
  BackButton,
} from "./components/common";
import { MiddleSection } from "./components/clock";
import { PomodoroTimer } from "./components/timer";
import { useTimerLogic } from "./utils/timerUtils";

function App() {
  const [time, setTime] = useState(new Date());
  const [isPinned, setIsPinned] = useState(false);
  const [isPinPinned, setIsPinPinned] = useState(false);
  const [isLockHovered, setIsLockHovered] = useState(false);
  const [isTimerHovered, setIsTimerHovered] = useState(false);
  const [isSettingsMode, setIsSettingsMode] = useState(false);

  // Pomodoro timer state
  const [isTimerMode, setIsTimerMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3 * 60); // 3 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const totalTime = 3 * 60; // 3 minutes

  const timeoutRef = useRef();

  // Use timer utility logic
  const { startTimer, cleanupTimer } = useTimerLogic(
    isTimerMode,
    isRunning,
    timeLeft,
    totalTime,
    setTimeLeft,
    setIsRunning,
    setCompletedSessions
  );

  const handlePin = () => {
    setIsPinPinned(!isPinPinned);

    // Send message to content script to toggle floating clock
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
    setIsTimerMode(!isTimerMode);
    if (!isTimerMode) {
      // Reset timer when entering timer mode
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
    // Reset all modes to go back to clock
    setIsTimerMode(false);
    setIsSettingsMode(false);
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  // Check if we should show the back button (any non-clock mode)
  const showBackButton = isTimerMode || isSettingsMode || isPinned;

  useEffect(() => {
    startTimer();
    return cleanupTimer;
  }, [isTimerMode, isRunning, timeLeft, totalTime]);

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
        <BackButton 
          onBackClick={handleBack} 
          isVisible={showBackButton}
        />
      </motion.div>

      {/* Middle section - Clock display or Pomodoro Timer */}
      {isTimerMode ? (
        <PomodoroTimer
          timeLeft={timeLeft}
          totalTime={totalTime}
          completedSessions={completedSessions}
          isRunning={isRunning}
          onToggleTimer={toggleTimer}
          onRestartTimer={restartTimer}
        />
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
        <SettingsButton />
      </motion.div>
    </div>
  );
}

export default App;
