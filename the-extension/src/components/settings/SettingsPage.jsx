import { useAppStore } from "../../store/appStore.ts";
import { motion } from "framer-motion";
import TimerSetting from "./TimerSetting";
import ThemeSettings from "./ThemeSettings";
import SettingsActions from "./SettingsActions";

function SettingsPage({ onClose, onSave }) {
  const { settings, setSettings } = useAppStore();

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
          value={Math.round(settings.pomodoroTime / 60000)}
          setValue={(val) =>
            setSettings({ ...settings, pomodoroTime: val * 60000 })
          }
          min={1}
          max={60}
        />
        <TimerSetting
          label="Break time"
          value={Math.round(settings.breakTime / 60000)}
          setValue={(val) =>
            setSettings({ ...settings, breakTime: val * 60000 })
          }
          min={1}
          max={60}
        />
      </div>

      {/* Theme Selection */}
      <div className="rounded-lg bg-base-200 items-center">
        <ThemeSettings
          selectedTheme={settings.theme}
          setSelectedTheme={(val) => setSettings({ ...settings, theme: val })}
          handleThemeHover={(theme) =>
            document.documentElement.setAttribute("data-theme", theme)
          }
          handleThemeSelect={(theme) => {
            setSettings({ ...settings, theme });
            document.documentElement.setAttribute("data-theme", theme);
          }}
        />
      </div>

      {/* Action Buttons */}
      <SettingsActions />
    </motion.div>
  );
}

export default SettingsPage;
