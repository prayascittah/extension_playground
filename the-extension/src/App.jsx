import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PinButton from "./components/PinButton";
import MiddleSection from "./components/MiddleSection";
import LockButton from "./components/LockButton";
import TimerButton from "./components/TimerButton";
import SettingsButton from "./components/SettingsButton";

function App() {
  const [time, setTime] = useState(new Date());
  const [isPinned, setIsPinned] = useState(false);
  const [isPinPinned, setIsPinPinned] = useState(false);
  const [isLockHovered, setIsLockHovered] = useState(false);
  const [isTimerHovered, setIsTimerHovered] = useState(false);
  const timeoutRef = useRef();

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
      {/* Left section - Pin button sliding from left */}
      <motion.div
        initial={{ x: -40, opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 130,
          mass: 1.5,
        }}
      >
        <PinButton isPinPinned={isPinPinned} onPinClick={handlePin} />
      </motion.div>

      {/* Middle section - Clock display */}
      <MiddleSection time={time} />

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
        />
        <SettingsButton />
      </motion.div>
    </div>
  );
}

export default App;
