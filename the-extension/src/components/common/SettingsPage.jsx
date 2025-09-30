import { useAppStore } from "../../store/appStore";
import { handleSettingsSave, handleSettingsClose } from "../../utils/utils";

function SettingsPage() {
  const {
    settings,
    setSettings,
    setTimeLeft,
    setIsSettingsMode,
    setIsTimerMode,
  } = useAppStore();

  // You may want to add your form logic here, using settings and the setters
  // For demonstration, here's a simple placeholder
  return (
    <div>
      <h2>Settings</h2>
      {/* Add your settings form here, using settings and setters */}
      <button
        onClick={() =>
          handleSettingsSave(
            setSettings,
            settings,
            setTimeLeft,
            setIsSettingsMode,
            setIsTimerMode
          )
        }
      >
        Save
      </button>
      <button
        onClick={() => handleSettingsClose(setIsSettingsMode, setIsTimerMode)}
      >
        Close
      </button>
    </div>
  );
}

export default SettingsPage;
