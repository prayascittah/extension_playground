import { useEffect, useRef, useState } from "react";
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
      {/* Top section - Pin button */}
      <PinButton isPinPinned={isPinPinned} onPinClick={handlePin} />

      {/* Middle section - Clock display */}
      <MiddleSection time={time} />

      {/* Right section - Action buttons */}
      <div className="flex flex-col justify-center gap-2">
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
      </div>
    </div>
  );
}

export default App;
