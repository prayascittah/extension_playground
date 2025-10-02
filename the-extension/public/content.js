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

function showFloatingPill(timerState) {
  if (floatingPill) removeFloatingPill();

  floatingPill = document.createElement("div");
  floatingPill.id = "extension-floating-pill";
  floatingPill.style.cssText = `
    position: fixed; top: 24px; left: 24px; z-index: 999999;
    background: #fff; border-radius: 999px; box-shadow: 0 2px 16px #0002;
    display: flex; align-items: center; padding: 8px 20px; min-width: 260px;
    font-family: inherit; border: 1px solid #e5e7eb;
    user-select: none;
  `;

  floatingPill.innerHTML = `
    <div class="pill-header" style="cursor: grab; display: flex; align-items: center;">
      <span class="pill-icon" style="font-size: 1.5em; margin-right: 10px;">${
        timerState.isBreakMode ? "☕" : "🍅"
      }</span>
      <span class="pill-label" style="margin-right: 10px; color: #555;">${
        timerState.isBreakMode ? "Break" : "Focus"
      }</span>
    </div>
    <span class="pill-timer" style="font-variant-numeric: tabular-nums; font-weight: bold; margin-right: 10px;">${formatTime(
      timerState.timeLeft
    )}</span>
    <span class="pill-session" style="font-size: 0.9em; color: #888; margin-right: 10px;">
      ${
        timerState.completedSessions > 0
          ? `Session: ${timerState.completedSessions} started`
          : ""
      }
    </span>
    <span class="pill-controls">
      ${
        timerState.isBreakMode
          ? `<button class="pill-btn pill-restart" title="Restart" style="margin-right: 4px;">🔄</button>`
          : `<button class="pill-btn pill-pause" title="${
              timerState.isRunning ? "Pause" : "Resume"
            }" style="margin-right: 4px;">${
              timerState.isRunning ? "⏸️" : "▶️"
            }</button>
           <button class="pill-btn pill-restart" title="Restart" style="margin-right: 4px;">🔄</button>`
      }
    </span>
    <button class="pill-btn pill-close" title="Close" style="margin-left: 8px;">✕</button>
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
      chrome.runtime.sendMessage({ action: "restartTimer" });
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
