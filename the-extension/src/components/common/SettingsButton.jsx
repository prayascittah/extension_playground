import { Settings } from "lucide-react";

function SettingsButton({ onSettingsClick, isSettingsMode }) {
  return (
    <button
      onClick={onSettingsClick}
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
