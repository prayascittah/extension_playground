import { useEffect, useRef } from "react";
import { useAppStore } from "./store/appStore.ts";
import { motion } from "framer-motion";
import {
  PinButton,
  LockButton,
  SettingsButton,
  TimerButton,
  BackButton,
} from "./components/common";
import { MiddleSection } from "./components/clock";
import { SettingsPage } from "./components/settings";
import { PomodoroTimer } from "./components/timer";
import BreakTimer from "./components/timer/BreakTimer";
import { useLiveClock } from "./utils/clockUtils";

function App() {
  const { setTime, isSettingsMode, isTimerMode, isBreakMode } = useAppStore();
  const timeoutRef = useRef();

  useEffect(useLiveClock(timeoutRef), [setTime]);

  return (
    <>
      <div className="w-110 h-60 bg-gray-100 flex p-2">
        {/* Left section - Pin button and Back button */}
        <motion.div
          initial={{ x: -40, opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 130,
            mass: 1.5,
          }}
          className="flex flex-col items-center"
        >
          <PinButton />
          <BackButton />
        </motion.div>

        {/* Middle section - Clock, Timer, or Settings */}
        {isSettingsMode ? (
          <SettingsPage />
        ) : isTimerMode ? (
          isBreakMode ? (
            <BreakTimer />
          ) : (
            <PomodoroTimer />
          )
        ) : (
          <MiddleSection />
        )}

        {/* Right section - Lock, Timer, Settings buttons */}
        <motion.div
          initial={{ x: 40, opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 130,
            mass: 1.5,
          }}
          className="flex flex-col justify-center gap-2"
        >
          <LockButton />
          <TimerButton />
          <SettingsButton />
        </motion.div>
      </div>
    </>
  );
}

export default App;
