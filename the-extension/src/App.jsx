import { useEffect, useRef, useState } from "react";
import PinButton from "./components/PinButton";
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
      <div className="flex-1 flex flex-col justify-between items-center">
        <div></div> {/* Spacer */}
        <div className="flex flex-col items-center">
          {/* Date and day header */}
          <div className="text-gray-700 text-sm mb-3 font-bold text-center">
            {time.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>

          {/* Main time display - Flip clock style */}
          <div className="flex items-center justify-center gap-4">
            {/* Hours Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-300 relative">
              <div className="text-6xl font-bold text-black tabular-nums leading-none">
                {time.getHours().toString().padStart(2, "0")}
              </div>
            </div>

            {/* Minutes Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-300 relative">
              <div className="text-6xl font-bold text-black tabular-nums leading-none">
                {time.getMinutes().toString().padStart(2, "0")}
              </div>
              {/* Seconds in bottom right of minutes card */}
              <div className="absolute bottom-2 right-2 bg-black text-white text-sm font-bold px-2 py-1 rounded-md shadow-md">
                {time.getSeconds().toString().padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center">
          made with love by Jayanth P<br />
          <span className="italic">a humble procrastinator</span>
        </div>
      </div>

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
