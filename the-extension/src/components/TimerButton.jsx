import { Timer } from "lucide-react";

function TimerButton({ isTimerHovered, setIsTimerHovered }) {
  return (
    <button
      onMouseEnter={() => setIsTimerHovered(true)}
      onMouseLeave={() => setIsTimerHovered(false)}
      className="p-2 rounded-lg transition-colors bg-gray-200 hover:bg-gray-300 text-black"
      title="Pomodoro Timer"
    >
      <Timer size={16} />
    </button>
  );
}

export default TimerButton;
