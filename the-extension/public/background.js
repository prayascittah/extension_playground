// Persistent Pomodoro timer logic for Chrome extension background script

let timerState = {
  isRunning: false,
  isBreakMode: false,
  timeLeft: 1 * 60 * 1000, // default 1 min
  pomodoroTime: 1 * 60 * 1000,
  breakTime: 1 * 60 * 1000,
  completedSessions: 0,
  lastTick: null,
};
let timerInterval = null;

// Helper to broadcast timer state to all tabs and popups
function broadcastTimerState() {
  chrome.runtime.sendMessage({ action: "updateTimerState", timerState });
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          action: "updateTimerState",
          timerState,
        });
      }
    }
  });
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerState.isRunning = true;
  timerState.lastTick = Date.now();
  timerInterval = setInterval(() => {
    if (!timerState.isRunning) return;
    const now = Date.now();
    const elapsed = now - timerState.lastTick;
    timerState.lastTick = now;
    timerState.timeLeft = Math.max(0, timerState.timeLeft - elapsed);
    if (timerState.timeLeft === 0) {
      if (!timerState.isBreakMode) {
        // Pomodoro finished, start break
        timerState.isBreakMode = true;
        timerState.timeLeft = timerState.breakTime;
        timerState.completedSessions += 1;
      } else {
        // Break finished, start pomodoro
        timerState.isBreakMode = false;
        timerState.timeLeft = timerState.pomodoroTime;
      }
    }
    broadcastTimerState();
  }, 1000);
  broadcastTimerState();
}

function pauseTimer() {
  timerState.isRunning = false;
  if (timerInterval) clearInterval(timerInterval);
  broadcastTimerState();
}

function resetTimer() {
  timerState.isRunning = false;
  timerState.isBreakMode = false;
  timerState.timeLeft = timerState.pomodoroTime;
  if (timerInterval) clearInterval(timerInterval);
  broadcastTimerState();
}

function restartTimer() {
  timerState.timeLeft = timerState.isBreakMode
    ? timerState.breakTime
    : timerState.pomodoroTime;
  timerState.isRunning = false;
  if (timerInterval) clearInterval(timerInterval);
  broadcastTimerState();
}

// Listen for commands from popup/content
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startTimer") {
    startTimer();
    sendResponse({ success: true });
  } else if (message.action === "pauseTimer") {
    pauseTimer();
    sendResponse({ success: true });
  } else if (message.action === "resetTimer") {
    resetTimer();
    sendResponse({ success: true });
  } else if (message.action === "restartTimer") {
    restartTimer();
    sendResponse({ success: true });
  } else if (message.action === "getTimerState") {
    sendResponse({ timerState });
  } else if (message.action === "togglePause") {
    if (timerState.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
    sendResponse({ success: true });
  } else if (message.action === "updateSettings") {
    // Update timer durations and reset timer if needed
    if (message.settings) {
      timerState.pomodoroTime = message.settings.pomodoroTime;
      timerState.breakTime = message.settings.breakTime;
      // If not running, reset timeLeft to new pomodoro/break time
      if (!timerState.isRunning) {
        timerState.timeLeft = timerState.isBreakMode
          ? timerState.breakTime
          : timerState.pomodoroTime;
      }
      broadcastTimerState();
    }
    sendResponse({ success: true });
  }
  return true; // keep message channel open for async
});

// On extension load, broadcast state
broadcastTimerState();
