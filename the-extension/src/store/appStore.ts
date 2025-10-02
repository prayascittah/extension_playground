// Add this at the top for TypeScript to recognize chrome
declare const chrome: any;
import { create } from "zustand";

interface Settings {
  pomodoroTime: number;
  breakTime: number;
  theme: string;
}

interface AppState {
  time: Date;
  setTime: (t: Date) => void;
  isPinned: boolean;
  setIsPinned: (v: boolean) => void;
  isPinPinned: boolean;
  setIsPinPinned: (v: boolean) => void;
  isLockHovered: boolean;
  setIsLockHovered: (v: boolean) => void;
  isTimerHovered: boolean;
  setIsTimerHovered: (v: boolean) => void;
  isSettingsMode: boolean;
  setIsSettingsMode: (v: boolean) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  isTimerMode: boolean;
  setIsTimerMode: (v: boolean) => void;
  timeLeft: number;
  setTimeLeft: (v: number) => void;
  isRunning: boolean;
  setIsRunning: (v: boolean) => void;
  completedSessions: number;
  setCompletedSessions: (v: number) => void;
  isBreakMode: boolean;
  setIsBreakMode: (v: boolean) => void;
  syncWithBackground: (timerState: Partial<AppState>) => void;
}

export const useAppStore = create<AppState>((set) => ({
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
  setSettings: (s) => {
    set({ settings: s });
    // Also update background timer if in extension context
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.sendMessage({ action: "updateSettings", settings: s });
    }
  },
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
  syncWithBackground: (timerState) => set({ ...timerState }),
}));
