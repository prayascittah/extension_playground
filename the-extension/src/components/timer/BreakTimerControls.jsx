import { Square } from "lucide-react";
import { useAppStore } from "../../store/appStore.ts";

function BreakTimerControls() {
  const handleStop = (e) => {
    e.stopPropagation();
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.sendMessage({ action: "restartTimer" });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleStop}
        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors w-8 h-8 flex items-center justify-center"
      >
        <Square size={16} className="text-black" />
      </button>
    </div>
  );
}

export default BreakTimerControls;
