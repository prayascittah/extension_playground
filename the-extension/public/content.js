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

  // Detect system theme
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const bg = isDark ? "#18181b" : "#fff";
  const fg = isDark ? "#fff" : "#111";
  const border = isDark ? "#333" : "#111";
  const shadow = isDark
    ? "0 4px 12px rgba(0,0,0,0.7)"
    : "0 4px 12px rgba(0,0,0,0.15)";

  // Icons: clock for focus, sleep for break
  const clockIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${fg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  const sleepIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${fg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M4 10h16"/><path d="M7 14h10"/><path d="M10 18h4"/></svg>`;

  floatingPill = document.createElement("div");
  floatingPill.id = "floating-pill";
  floatingPill.style.cssText = `
    all: unset; position: fixed; top: 24px; right: 24px; z-index: 2147483647;
    background: ${bg}; border: 2px solid ${border}; border-radius: 12px;
    box-shadow: ${shadow};
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 6px 14px; min-width: 180px; height: 36px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    color: ${fg}; user-select: none; cursor: grab;
    transition: background 0.2s, color 0.2s;
  `;

  // SVGs for play (use) and pause
  const playSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20"><path fill="currentColor" d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"/></svg>`;
  const pauseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20"><path fill="currentColor" d="M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"/></svg>`;

  floatingPill.innerHTML = `
    <span style="display: flex; align-items: center;">${
      timerState.isBreakMode ? sleepIcon : clockIcon
    }</span>
    <span style="font-size: 13px; font-weight: 600; text-align: center; min-width: 48px;">${
      timerState.isBreakMode ? "Break" : "Focus"
    }</span>
    <span style="font-variant-numeric: tabular-nums; font-weight: 700; font-size: 15px; letter-spacing: 0.5px; min-width: 48px; text-align: center;">${formatTime(
      timerState.timeLeft
    )}</span>
    <button class="pill-pause" style="all: unset; cursor: pointer; padding: 4px; display: flex; align-items: center; font-size: 16px; color: ${fg};">${
    timerState.isRunning ? pauseSvg : playSvg
  }</button>
    <button class="pill-restart" style="all: unset; cursor: pointer; padding: 4px; font-size: 16px;">🔄</button>
    <button class="pill-close" style="all: unset; cursor: pointer; padding: 4px; font-size: 16px;">✖️</button>
  `;

  document.body.appendChild(floatingPill);

  // Make draggable
  floatingPill.onmousedown = (e) => {
    isDragging = true;
    dragOffset.x = e.clientX - floatingPill.offsetLeft;
    dragOffset.y = e.clientY - floatingPill.offsetTop;
    floatingPill.style.cursor = "grabbing";
    // Fix width to prevent jump/stretch
    floatingPill.style.width = floatingPill.offsetWidth + "px";
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
    if (floatingPill) {
      floatingPill.style.cursor = "grab";
      // Remove fixed width after drag
      floatingPill.style.width = "";
    }
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
