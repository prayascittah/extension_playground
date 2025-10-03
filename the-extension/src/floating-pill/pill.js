// Minimal JS for floating pill (add drag/timer logic as needed)
// Example: Drag from anywhere on the pill
const pill = document.getElementById('floating-pill');
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

pill.addEventListener('mousedown', (e) => {
  isDragging = true;
  const rect = pill.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;
  pill.style.left = x + 'px';
  pill.style.top = y + 'px';
  pill.style.right = 'auto';
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.userSelect = '';
});
