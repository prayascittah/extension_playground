import { Settings } from "lucide-react";
import { useAppStore } from "../../store/appStore.ts";
import { handleSettings } from "../../utils/utils";

function SettingsButton() {
  const { isSettingsMode, setIsTimerMode, setIsSettingsMode } = useAppStore();
  return (
    <button
      onClick={() =>
        handleSettings(setIsTimerMode, setIsSettingsMode, isSettingsMode)
      }
      className={`p-2 rounded-lg transition-colors ${
        isSettingsMode
          ? "bg-black text-white"
          : "bg-gray-200 hover:bg-gray-300 text-black"
      }`}
      title="Settings"
    >
      <Settings size={16} />
    </button>
  );
}

export default SettingsButton;
