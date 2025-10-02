import { useAppStore } from "../../store/appStore";

function SettingsActions() {
  const {
    isSettingsMode,
    settings,
    setSettings,
    setIsSettingsMode,
    setIsTimerMode,
  } = useAppStore();

  const handleSave = () => {
    const pomodoroTime = Math.round(settings.pomodoroTime / 60000);
    const breakTime = Math.round(settings.breakTime / 60000);
    const selectedTheme = settings.theme;

    setSettings({
      ...settings,
      pomodoroTime: pomodoroTime * 60000,
      breakTime: breakTime * 60000,
      theme: selectedTheme,
    });
    setIsSettingsMode(false);
    setIsTimerMode(true);
  };

  const handleClose = () => {
    const selectedTheme = settings.theme;
    document.documentElement.setAttribute(
      "data-theme",
      selectedTheme || "light"
    );
    isSettingsMode(false);
  };

  return (
    <div className="flex justify-end gap-3">
      <button
        onClick={handleClose}
        className="px-3 py-1.5 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors text-sm font-medium"
      >
        Close
      </button>
      <button
        onClick={handleSave}
        className="px-3 py-1.5 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors text-sm font-medium"
      >
        Save
      </button>
    </div>
  );
}

export default SettingsActions;
