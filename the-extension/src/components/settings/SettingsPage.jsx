import { useAppStore } from "../../store/appStore";
import { motion } from "framer-motion";
import TimerSetting from "./TimerSetting";
import ThemeSettings from "./ThemeSettings";
import SettingsActions from "./SettingsActions";

function SettingsPage({ onClose, onSave }) {
  const { settings, setSettings } = useAppStore();
  const pomodoroTime = settings.pomodoroTime;
  const breakTime = settings.breakTime;
  const selectedTheme = settings.theme;
  const setPomodoroTime = (val) =>
    setSettings({ ...settings, pomodoroTime: val });
  const setBreakTime = (val) => setSettings({ ...settings, breakTime: val });
  const setSelectedTheme = (val) => setSettings({ ...settings, theme: val });

  // DaisyUI themes available
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

  const handleThemeHover = (theme) => {
    // Apply theme temporarily on hover
    document.documentElement.setAttribute("data-theme", theme);
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    // Apply theme on click and keep it
    document.documentElement.setAttribute("data-theme", theme);
  };

  const handleSave = () => {
    onSave({ pomodoroTime, breakTime, theme: selectedTheme });
  };

  const handleClose = () => {
    document.documentElement.setAttribute(
      "data-theme",
      selectedTheme || "light"
    );
    onClose();
  };

  return (
    <motion.div
      className="flex flex-col justify-between gap-3 flex-1 pl-3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100,
        mass: 1,
      }}
    >
      {/* Timer Settings */}
      <div className="flex flex-col gap-5 py-2.5 rounded-lg bg-base-200 items-center w-4/5">
        <TimerSetting
          label="Pomodoro time"
          value={pomodoroTime}
          setValue={setPomodoroTime}
          min={1}
          max={60}
        />
        <TimerSetting
          label="Break time"
          value={breakTime}
          setValue={setBreakTime}
          min={1}
          max={60}
        />
      </div>

      {/* Theme Selection */}
      <div className="rounded-lg bg-base-200 items-center">
        <ThemeSettings
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          themes={themes}
          handleThemeHover={handleThemeHover}
          handleThemeSelect={handleThemeSelect}
        />
      </div>

      {/* Action Buttons */}
      <SettingsActions onClose={handleClose} onSave={handleSave} />
    </motion.div>
  );
}

export default SettingsPage;
