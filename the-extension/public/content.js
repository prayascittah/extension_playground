// Floating clock content script
let floatingClock = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleFloatingClock") {
    if (floatingClock) {
      removeFloatingClock();
    } else {
      createFloatingClock();
    }
    sendResponse({ success: true });
  }
});

function createFloatingClock() {
  // Remove existing clock if any
  if (floatingClock) {
    removeFloatingClock();
  }

  // Create floating div
  floatingClock = document.createElement("div");
  floatingClock.id = "extension-floating-clock";
  floatingClock.innerHTML = `
    <div class="clock-header">
      <span class="clock-title">⏰ Clock</span>
      <button class="clock-close">✕</button>
    </div>
    <div class="clock-time">
      <span class="time-display">--:--</span>
      <span class="seconds-display">--</span>
    </div>
  `;

  // Add to page
  document.body.appendChild(floatingClock);

  // Make draggable
  makeDraggable(floatingClock);

  // Start time updates
  updateTime();
  setInterval(updateTime, 1000);

  // Add close functionality
  floatingClock
    .querySelector(".clock-close")
    .addEventListener("click", removeFloatingClock);
}

function removeFloatingClock() {
  if (floatingClock) {
    floatingClock.remove();
    floatingClock = null;
  }
}

function updateTime() {
  if (!floatingClock) return;

  const now = new Date();
  const timeDisplay = floatingClock.querySelector(".time-display");
  const secondsDisplay = floatingClock.querySelector(".seconds-display");

  if (timeDisplay && secondsDisplay) {
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    timeDisplay.textContent = `${hours}:${minutes}`;
    secondsDisplay.textContent = `${seconds}s`;
  }
}

function makeDraggable(element) {
  const header = element.querySelector(".clock-header");

  header.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);

  function startDrag(e) {
    isDragging = true;
    const rect = element.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    header.style.cursor = "grabbing";
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
  }
}

// Initialize time immediately if clock exists
if (floatingClock) {
  updateTime();
}
