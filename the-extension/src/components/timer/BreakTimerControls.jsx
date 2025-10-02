import { Play, Pause, Square } from "lucide-react";
import { useAppStore } from "../../store/appStore.ts";

function BreakTimerControls() {
  const { isRunning, setIsRunning, setTimeLeft, settings } = useAppStore();

  const handlePlayPause = (e) => {
    e.stopPropagation();
    setIsRunning(!isRunning);
  };

  const handleStop = (e) => {
    e.stopPropagation();
    setIsRunning(false);
    setTimeLeft(settings.breakTime);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePlayPause}
        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors w-8 h-8 flex items-center justify-center"
      >
        {isRunning ? (
          <Pause size={16} className="text-black" />
        ) : (
          <Play size={16} className="text-black" />
        )}
      </button>
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
