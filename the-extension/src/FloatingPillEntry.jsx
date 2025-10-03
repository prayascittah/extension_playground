import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import FloatingPill from "./components/FloatingPill";

function FloatingPillApp() {
  const [timerState, setTimerState] = useState(null);
  const [showPill, setShowPill] = useState(false);

  useEffect(() => {
    // Listen for timer state messages from popup/background
    const messageListener = (message, sender, sendResponse) => {
      if (message.action === "showFloatingPill") {
        setTimerState(message.timerState);
        setShowPill(true);
        sendResponse({ success: true });
      }
      if (message.action === "hideFloatingPill") {
        setShowPill(false);
        sendResponse({ success: true });
      }
      if (message.action === "updateTimerState") {
        setTimerState(message.timerState);
        sendResponse({ success: true });
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // On content script load, request timer state from background
    chrome.runtime.sendMessage({ action: "getTimerState" }, (response) => {
      if (response && response.timerState) {
        setTimerState(response.timerState);
        // Show pill if timer is running or in break mode
        if (response.timerState.isRunning || response.timerState.isBreakMode) {
          setShowPill(true);
        }
      }
    });

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handlePause = () => {
    chrome.runtime.sendMessage({ action: "togglePause" });
  };

  const handleRestart = () => {
    chrome.runtime.sendMessage({ action: "restartTimer" }, () => {
      chrome.runtime.sendMessage({ action: "startTimer" });
    });
  };

  const handleClose = () => {
    setShowPill(false);
  };

  if (!showPill || !timerState) {
    return null;
  }

  return (
    <FloatingPill
      timerState={timerState}
      onPause={handlePause}
      onRestart={handleRestart}
      onClose={handleClose}
    />
  );
}

// Inject CSS to ensure pill container is isolated from website styles
const cssId = "pomodoro-pill-styles";
if (!document.getElementById(cssId)) {
  const style = document.createElement("style");
  style.id = cssId;
  style.textContent = `
    #pomodoro-floating-pill-root {
      all: unset !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      pointer-events: none !important;
      z-index: 2147483647 !important;
      isolation: isolate !important;
    }
    #pomodoro-floating-pill-root * {
      box-sizing: border-box !important;
    }
  `;
  document.head.appendChild(style);
}

// Create a container div for the pill if it doesn't exist
const pillContainerId = "pomodoro-floating-pill-root";
let pillContainer = document.getElementById(pillContainerId);
if (!pillContainer) {
  pillContainer = document.createElement("div");
  pillContainer.id = pillContainerId;
  pillContainer.style.cssText = `
    all: unset !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    pointer-events: none !important;
    z-index: 2147483647 !important;
    isolation: isolate !important;
  `;
  document.body.appendChild(pillContainer);
}

// Mount the React FloatingPill
const root = createRoot(pillContainer);
root.render(<FloatingPillApp />);
