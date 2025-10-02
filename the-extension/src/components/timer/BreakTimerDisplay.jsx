import { useAppStore } from "../../store/appStore.ts";
import { formatTime } from "../../utils/timerUtils";

function BreakTimerDisplay() {
  const { timeLeft } = useAppStore();
  const displayTime = formatTime(timeLeft);

  return (
    <div className="text-2xl font-medium text-black mb-2 tracking-wider">
      {displayTime}
    </div>
  );
}

export default BreakTimerDisplay;
