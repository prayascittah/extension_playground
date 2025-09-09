import { useEffect, useRef, useState } from "react";

function App() {
  const [time, setTime] = useState(new Date());
  const [isPinned, setIsPinned] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    const getTime = () => {
      const now = new Date();
      setTime(now);
      timeoutRef.current = setTimeout(getTime, 1000 - now.getMilliseconds());
    };
    getTime();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handlePin = () => {
    setIsPinned(!isPinned);

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

  // Check if we're in floating mode
  const isFloatingMode =
    new URLSearchParams(window.location.search).get("mode") === "floating";

  // Regular popup mode
  return (
    <div className="w-80 h-96 bg-gradient-to-br from-purple-200 to-purple-300 flex flex-col items-center justify-center p-4 relative">
      {/* Pin button in top left */}
      <button
        onClick={handlePin}
        className={`absolute top-3 left-3 p-2 rounded-lg transition-colors ${
          isPinned
            ? "bg-purple-600 text-white shadow-lg"
            : "bg-white/70 text-purple-600 hover:bg-white/90"
        }`}
        title={
          isPinned
            ? "Pinned - Toggle floating clock"
            : "Pin to show floating clock"
        }
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
        </svg>
      </button>

      {/* Date and day header */}
      <div className="text-purple-700 text-sm mb-2 font-medium">
        {time
          .toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "/")}{" "}
        • {time.toLocaleDateString("en-US", { weekday: "long" })}
      </div>

      {/* Main time display - Flip clock style */}
      <div className="flex items-center space-x-4 mb-6">
        {/* Hours Card */}
        <div className="bg-white/70 rounded-2xl p-6 shadow-xl border border-purple-200 relative backdrop-blur-sm">
          <div className="text-6xl font-bold text-purple-800 tabular-nums leading-none">
            {time.getHours().toString().padStart(2, "0")}
          </div>
          {/* Horizontal line through middle */}
        </div>

        {/* Minutes Card */}
        <div className="bg-white/70 rounded-2xl p-6 shadow-xl border border-purple-200 relative backdrop-blur-sm">
          <div className="text-6xl font-bold text-purple-800 tabular-nums leading-none">
            {time.getMinutes().toString().padStart(2, "0")}
          </div>
          {/* Seconds in bottom right of minutes card */}
          <div className="absolute bottom-2 right-2 bg-purple-500 text-white text-sm font-bold px-2 py-1 rounded-md shadow-md">
            {time.getSeconds().toString().padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Hyperfocus button */}
      <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg">
        Hyperfocus Mode
      </button>
    </div>
  );
}

export default App;
