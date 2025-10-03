// Clean monochrome floating pill content script
let floatingPill = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Listen for timer messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showFloatingPill") {
    showFloatingPill(message.timerState);
    sendResponse({ success: true });
  }
  if (message.action === "hideFloatingPill") {
    removeFloatingPill();
    sendResponse({ success: true });
  }
  if (message.action === "updateTimerState") {
    updatePillUI(message.timerState);
    sendResponse({ success: true });
  }
});

// Request timer state on load
chrome.runtime.sendMessage({ action: "getTimerState" }, (response) => {
  if (response && response.timerState) {
    if (response.timerState.isRunning || response.timerState.isBreakMode) {
      showFloatingPill(response.timerState);
    }
  }
});

function showFloatingPill(timerState) {
  if (floatingPill) removeFloatingPill();

  floatingPill = document.createElement("div");
  floatingPill.id = "floating-pill";
  floatingPill.style.cssText = `
    all: unset; position: fixed; top: 24px; right: 24px; z-index: 2147483647;
    background: #fff; border: 2px solid #111; border-radius: 32px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex; align-items: center; gap: 12px;
    padding: 12px 20px; min-width: 240px; height: 48px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    color: #111; user-select: none; cursor: grab;
  `;

  floatingPill.innerHTML = `
    <span style="font-size: 14px; font-weight: 600;">${
      timerState.isBreakMode ? "Break" : "Focus"
    }</span>
    <span style="font-variant-numeric: tabular-nums; font-weight: 700; font-size: 18px; letter-spacing: 0.5px;">${formatTime(
      timerState.timeLeft
    )}</span>
    <button class="pill-pause" style="all: unset; cursor: pointer; padding: 4px; display: flex; align-items: center;">
      ${timerState.isRunning ? "⏸️" : "▶️"}
    </button>
    <button class="pill-restart" style="all: unset; cursor: pointer; padding: 4px;">🔄</button>
    <button class="pill-close" style="all: unset; cursor: pointer; padding: 4px;">✖️</button>
  `;

  document.body.appendChild(floatingPill);

  // Make draggable
  floatingPill.onmousedown = (e) => {
    isDragging = true;
    dragOffset.x = e.clientX - floatingPill.offsetLeft;
    dragOffset.y = e.clientY - floatingPill.offsetTop;
    floatingPill.style.cursor = "grabbing";
  };

  document.onmousemove = (e) => {
    if (!isDragging) return;
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    floatingPill.style.left =
      Math.max(0, Math.min(window.innerWidth - floatingPill.offsetWidth, x)) +
      "px";
    floatingPill.style.top =
      Math.max(0, Math.min(window.innerHeight - floatingPill.offsetHeight, y)) +
      "px";
  };

  document.onmouseup = () => {
    isDragging = false;
    if (floatingPill) floatingPill.style.cursor = "grab";
  };

  // Button handlers
  floatingPill.querySelector(".pill-close").onclick = () => {
    // Ask background to broadcast hideFloatingPill to all tabs
    chrome.runtime.sendMessage({ action: "broadcastHideFloatingPill" });
    removeFloatingPill();
  };
  floatingPill.querySelector(".pill-pause").onclick = () =>
    chrome.runtime.sendMessage({ action: "togglePause" });
  floatingPill.querySelector(".pill-restart").onclick = () => {
    chrome.runtime.sendMessage({ action: "restartTimer" });
    chrome.runtime.sendMessage({ action: "startTimer" });
  };
}

function removeFloatingPill() {
  if (floatingPill) {
    floatingPill.remove();
    floatingPill = null;
  }
}

function updatePillUI(timerState) {
  if (!floatingPill) return;
  const labelSpan = floatingPill.querySelector("span");
  const timerSpan = floatingPill.querySelector("span:nth-child(2)");
  const pauseBtn = floatingPill.querySelector(".pill-pause");

  if (labelSpan)
    labelSpan.textContent = timerState.isBreakMode ? "Break" : "Focus";
  if (timerSpan) timerSpan.textContent = formatTime(timerState.timeLeft);
  if (pauseBtn) pauseBtn.textContent = timerState.isRunning ? "⏸️" : "▶️";
}

function formatTime(ms) {
  if (ms == null || ms < 0 || isNaN(ms)) return "00:00";
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
