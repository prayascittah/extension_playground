import { create } from "zustand";

export const useAppStore = create((set) => ({
  time: new Date(),
  setTime: (t) => set({ time: t }),
  isPinned: false,
  setIsPinned: (v) => set({ isPinned: v }),
  isPinPinned: false,
  setIsPinPinned: (v) => set({ isPinPinned: v }),
  isLockHovered: false,
  setIsLockHovered: (v) => set({ isLockHovered: v }),
  isTimerHovered: false,
  setIsTimerHovered: (v) => set({ isTimerHovered: v }),
  isSettingsMode: false,
  setIsSettingsMode: (v) => set({ isSettingsMode: v }),
  settings: {
    pomodoroTime: 1 * 60 * 1000, // 1 minute in ms
    breakTime: 1 * 60 * 1000, // 1 minute in ms
    theme: "light",
  },
  setSettings: (s) => set({ settings: s }),
  isTimerMode: false,
  setIsTimerMode: (v) => set({ isTimerMode: v }),
  timeLeft: 1 * 60 * 1000, // 1 minute in ms
  setTimeLeft: (v) => set({ timeLeft: v }),
  isRunning: false,
  setIsRunning: (v) => set({ isRunning: v }),
  completedSessions: 0,
  setCompletedSessions: (v) => set({ completedSessions: v }),
  isBreakMode: false,
  setIsBreakMode: (v) => set({ isBreakMode: v }),
}));
