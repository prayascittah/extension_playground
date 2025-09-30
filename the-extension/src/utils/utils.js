export const handlePin = (setIsPinPinned, isPinPinned) => {
  setIsPinPinned(!isPinPinned);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "toggleFloatingClock" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.log("Content script not ready, that's okay");
        }
      }
    );
  });
};

export const handleTimer = (
  setIsSettingsMode,
  setIsTimerMode,
  isTimerMode,
  setTimeLeft,
  totalTime,
  setIsRunning,
  setIsBreakMode
) => {
  setIsSettingsMode(false);
  setIsTimerMode(!isTimerMode);
  if (!isTimerMode) {
    setTimeLeft(totalTime);
    setIsRunning(false);
    setIsBreakMode(false);
  }
};

export const toggleTimer = (setIsRunning, isRunning) => {
  console.debug("App: toggleTimer ->", !isRunning);
  setIsRunning(!isRunning);
};

export const restartTimer = (
  setIsRunning,
  isBreakMode,
  setTimeLeft,
  settings,
  totalTime
) => {
  setIsRunning(false);
  if (isBreakMode) {
    setTimeLeft(settings.breakTime);
  } else {
    setTimeLeft(totalTime);
  }
};

export const handleBack = (setIsTimerMode, setIsSettingsMode) => {
  setIsTimerMode(false);
  setIsSettingsMode(false);
};

export const handleSettings = (
  setIsTimerMode,
  setIsSettingsMode,
  isSettingsMode
) => {
  setIsTimerMode(false);
  setIsSettingsMode(!isSettingsMode);
};

export const handleLock = () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("url-blocker.html"),
  });
};

export const handleSettingsSave = (
  setSettings,
  newSettings,
  setTimeLeft,
  setIsSettingsMode,
  setIsTimerMode
) => {
  setSettings(newSettings);
  const newTotalTime = newSettings.pomodoroTime;
  setTimeLeft(newTotalTime);
  setIsSettingsMode(false);
  setIsTimerMode(true);
};

export const handleSettingsClose = (setIsSettingsMode, setIsTimerMode) => {
  setIsSettingsMode(false);
  setIsTimerMode(true);
};

export const cleanupTimer = (timeoutRef) => {
  console.debug("Cleaning up timer");
  if (timeoutRef?.current) {
    clearTimeout(timeoutRef.current);
  }
};
