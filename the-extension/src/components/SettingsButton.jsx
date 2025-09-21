import { Settings } from "lucide-react";

function SettingsButton() {
  return (
    <button
      className="p-2 rounded-lg transition-colors bg-gray-200 hover:bg-gray-300 text-black"
      title="Settings"
    >
      <Settings size={16} />
    </button>
  );
}

export default SettingsButton;
