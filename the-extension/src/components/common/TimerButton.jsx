import { Timer } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { handleTimer } from "../../utils/utils";

function TimerButton() {
  const {
    setIsTimerHovered,
    isTimerMode,
    setIsSettingsMode,
    setIsTimerMode,
    isTimerMode: timerMode,
    setTimeLeft,
    settings,
    setIsRunning,
    setIsBreakMode,
  } = useAppStore();
  return (
    <button
      onClick={() =>
        handleTimer(
          setIsSettingsMode,
          setIsTimerMode,
          timerMode,
          setTimeLeft,
          settings.pomodoroTime,
          setIsRunning,
          setIsBreakMode
        )
      }
      onMouseEnter={() => setIsTimerHovered(true)}
      onMouseLeave={() => setIsTimerHovered(false)}
      className={`p-2 rounded-lg transition-colors ${
        isTimerMode
          ? "bg-black text-white hover:bg-gray-800"
          : "bg-gray-200 hover:bg-gray-300 text-black"
      }`}
      title="Pomodoro Timer"
    >
      <Timer size={16} />
    </button>
  );
}

export default TimerButton;
