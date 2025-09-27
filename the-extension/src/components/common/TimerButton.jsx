import { Timer } from "lucide-react";

function TimerButton({ setIsTimerHovered, onTimerClick, isTimerMode }) {
  return (
    <button
      onClick={onTimerClick}
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
