// Floating Pomodoro/Break pill content script

let floatingPill = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Listen for timer state messages from popup/background
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

// On content script load, request timer state from background
chrome.runtime.sendMessage({ action: "getTimerState" }, (response) => {
  if (response && response.timerState) {
    // Show pill if timer is running or in break mode
    if (response.timerState.isRunning || response.timerState.isBreakMode) {
      showFloatingPill(response.timerState);
    }
  }
});

function showFloatingPill(timerState) {
  if (floatingPill) removeFloatingPill();

  floatingPill = document.createElement("div");
  floatingPill.id = "extension-floating-pill";
  floatingPill.style.cssText = `
    position: fixed; top: 24px; left: 24px; z-index: 999999;
    background: #fff; border-radius: 999px; box-shadow: 0 2px 16px #0003;
    display: flex; align-items: center; padding: 18px 32px; min-width: 320px; min-height: 64px;
    font-family: inherit; border: 2px solid #111;
    user-select: none; color: #111;
    gap: 18px;
  `;

  // Lucide SVG icons (https://lucide.dev/icons)
  const playIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
  const pauseIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
  const restartIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`;
  const closeIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  const tomatoIcon = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="15" rx="9" ry="7" fill="#fff"/><path d="M12 7V3"/><path d="M12 3c-1 2-3 3-5 3"/><path d="M12 3c1 2 3 3 5 3"/></svg>`;
  const breakIcon = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="8" rx="4" fill="#fff"/><rect x="8" y="6" width="8" height="4" rx="2" fill="#fff"/></svg>`;

  floatingPill.innerHTML = `
    <div class="pill-header" style="cursor: grab; display: flex; align-items: center; gap: 10px;">
      <span class="pill-icon" style="display: flex; align-items: center;">${
        timerState.isBreakMode ? breakIcon : tomatoIcon
      }</span>
      <span class="pill-label" style="font-size: 1.1em; font-weight: 600; color: #111;">${
        timerState.isBreakMode ? "Break" : "Focus"
      }</span>
    </div>
    <span class="pill-timer" style="font-variant-numeric: tabular-nums; font-weight: bold; font-size: 2em; margin-right: 10px; letter-spacing: 0.04em;">${formatTime(
      timerState.timeLeft
    )}</span>
    <span class="pill-session" style="font-size: 1em; color: #444; margin-right: 10px;">
      ${
        timerState.completedSessions > 0
          ? `Session: ${timerState.completedSessions} started`
          : ""
      }
    </span>
    <span class="pill-controls" style="display: flex; align-items: center; gap: 6px;">
      ${
        timerState.isBreakMode
          ? `<button class="pill-btn pill-restart" title="Restart" style="background: none; border: none; cursor: pointer; padding: 4px;">${restartIcon}</button>`
          : `<button class="pill-btn pill-pause" title="${
              timerState.isRunning ? "Pause" : "Resume"
            }" style="background: none; border: none; cursor: pointer; padding: 4px;">${
              timerState.isRunning ? pauseIcon : playIcon
            }</button>
           <button class="pill-btn pill-restart" title="Restart" style="background: none; border: none; cursor: pointer; padding: 4px;">${restartIcon}</button>`
      }
    </span>
    <button class="pill-btn pill-close" title="Close" style="background: none; border: none; cursor: pointer; margin-left: 8px; padding: 4px;">${closeIcon}</button>
  `;

  document.body.appendChild(floatingPill);
  makeDraggable(floatingPill);

  // Button handlers
  floatingPill.querySelector(".pill-close").onclick = removeFloatingPill;
  if (floatingPill.querySelector(".pill-pause")) {
    floatingPill.querySelector(".pill-pause").onclick = () => {
      chrome.runtime.sendMessage({ action: "togglePause" });
    };
  }
  if (floatingPill.querySelector(".pill-restart")) {
    floatingPill.querySelector(".pill-restart").onclick = () => {
      chrome.runtime.sendMessage({ action: "restartTimer" }, () => {
        chrome.runtime.sendMessage({ action: "startTimer" });
      });
    };
  }

  // Notification for break
  if (timerState.isBreakMode && timerState.completedSessions > 0) {
    showBreakNotification();
  }
}

function removeFloatingPill() {
  if (floatingPill) {
    floatingPill.remove();
    floatingPill = null;
  }
}

function updatePillUI(timerState) {
  if (!floatingPill) return;
  floatingPill.querySelector(".pill-icon").textContent = timerState.isBreakMode
    ? "☕"
    : "🍅";
  floatingPill.querySelector(".pill-label").textContent = timerState.isBreakMode
    ? "Break"
    : "Focus";
  floatingPill.querySelector(".pill-timer").textContent = formatTime(
    timerState.timeLeft
  );
  floatingPill.querySelector(".pill-session").textContent =
    timerState.completedSessions > 0
      ? `Session: ${timerState.completedSessions} started`
      : "";
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

function showBreakNotification() {
  const notif = document.createElement("div");
  notif.textContent = "Time for a break!";
  notif.style.cssText = `
    position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
    background: #2563eb; color: #fff; padding: 10px 24px; border-radius: 999px;
    font-size: 1.1em; z-index: 999999; box-shadow: 0 2px 16px #0002;
    transition: opacity 0.3s;
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2500);
}

// Drag logic
function makeDraggable(element) {
  const header = element.querySelector(".pill-header");
  if (!header) return;

  header.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);

  function startDrag(e) {
    isDragging = true;
    const rect = element.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    header.style.cursor = "grabbing";
    element.style.transition = "none";
  }

  function drag(e) {
    if (!isDragging) return;
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    // Keep within viewport bounds
    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;
    element.style.left = Math.max(0, Math.min(maxX, x)) + "px";
    element.style.top = Math.max(0, Math.min(maxY, y)) + "px";
  }

  function stopDrag() {
    isDragging = false;
    header.style.cursor = "grab";
    element.style.transition = "";
  }
}
