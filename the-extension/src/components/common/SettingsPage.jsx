import { useState } from "react";
import { motion } from "framer-motion";
import {
  PomodoroTimerSetting,
  BreakTimerSetting,
  ThemeSettings,
  SettingsActions,
} from "../settings";

function SettingsPage({ onClose, onSave, currentSettings }) {
  const [pomodoroTime, setPomodoroTime] = useState(
    currentSettings.pomodoroTime || 25
  );
  const [breakTime, setBreakTime] = useState(currentSettings.breakTime || 5);
  const [selectedTheme, setSelectedTheme] = useState(
    currentSettings.theme || "light"
  );

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
    onSave({
      pomodoroTime,
      breakTime,
      theme: selectedTheme,
    });
  };

  const handleClose = () => {
    // Reset to original theme if closing without saving
    document.documentElement.setAttribute(
      "data-theme",
      currentSettings.theme || "light"
    );
    onClose();
  };

  return (
    <motion.div
      className="flex-1 flex flex-col p-2"
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
      <div className="mb-6 flex flex-col gap-4">
        <PomodoroTimerSetting
          pomodoroTime={pomodoroTime}
          setPomodoroTime={setPomodoroTime}
        />
        <BreakTimerSetting breakTime={breakTime} setBreakTime={setBreakTime} />
      </div>

      {/* Theme Selection */}
      <ThemeSettings
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        themes={themes}
        handleThemeHover={handleThemeHover}
        handleThemeSelect={handleThemeSelect}
      />

      {/* Action Buttons */}
      <SettingsActions onClose={handleClose} onSave={handleSave} />
    </motion.div>
  );
}

export default SettingsPage;
