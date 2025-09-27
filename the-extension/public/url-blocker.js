// URL Blocker functionality
class URLBlocker {
  constructor() {
    this.blockedUrls = [];
    this.init();
  }

  async init() {
    await this.loadBlockedUrls();
    this.setupEventListeners();
    this.renderUrls();
  }

  async loadBlockedUrls() {
    try {
      const result = await chrome.storage.sync.get(["blockedUrls"]);
      this.blockedUrls = result.blockedUrls || [];
    } catch (error) {
      console.error("Error loading blocked URLs:", error);
      this.blockedUrls = [];
    }
  }

  async saveBlockedUrls() {
    try {
      await chrome.storage.sync.set({ blockedUrls: this.blockedUrls });
    } catch (error) {
      console.error("Error saving blocked URLs:", error);
    }
  }

  setupEventListeners() {
    const urlInput = document.getElementById("urlInput");
    const addBtn = document.getElementById("addUrlBtn");

    // Add URL when button is clicked
    addBtn.addEventListener("click", () => this.addUrl());

    // Add URL when Enter is pressed
    urlInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addUrl();
      }
    });
  }

  normalizeUrl(url) {
    // Remove protocol and www prefix, convert to lowercase
    return url
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, ""); // Remove trailing slash
  }

  isValidUrl(url) {
    // Basic URL validation
    const urlPattern =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return urlPattern.test(url);
  }

  addUrl() {
    const urlInput = document.getElementById("urlInput");
    const rawUrl = urlInput.value.trim();

    if (!rawUrl) {
      this.showNotification("Please enter a URL", "error");
      return;
    }

    const normalizedUrl = this.normalizeUrl(rawUrl);

    if (!this.isValidUrl(normalizedUrl)) {
      this.showNotification("Please enter a valid URL", "error");
      return;
    }

    if (this.blockedUrls.includes(normalizedUrl)) {
      this.showNotification("URL is already blocked", "warning");
      return;
    }

    this.blockedUrls.push(normalizedUrl);
    this.saveBlockedUrls();
    this.renderUrls();
    urlInput.value = "";
    this.showNotification(`Blocked ${normalizedUrl}`, "success");
  }

  removeUrl(url) {
    const index = this.blockedUrls.indexOf(url);
    if (index > -1) {
      this.blockedUrls.splice(index, 1);
      this.saveBlockedUrls();
      this.renderUrls();
      this.showNotification(`Unblocked ${url}`, "success");
    }
  }

  renderUrls() {
    const urlList = document.getElementById("urlList");
    const emptyState = document.getElementById("emptyState");

    if (this.blockedUrls.length === 0) {
      urlList.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    urlList.style.display = "block";
    emptyState.style.display = "none";

    urlList.innerHTML = this.blockedUrls
      .map(
        (url) => `
            <li class="url-item">
                <span class="url-text text-lg">${url}</span>
                <button class="delete-btn" onclick="urlBlocker.removeUrl('${url}')">
                    Remove
                </button>
            </li>
        `
      )
      .join("");
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;

    const colors = {
      success: "#48bb78",
      error: "#f56565",
      warning: "#ed8936",
      info: "#4299e1",
    };

    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;

    // Add animation styles
    const style = document.createElement("style");
    style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize URL blocker when page loads
let urlBlocker;
document.addEventListener("DOMContentLoaded", () => {
  urlBlocker = new URLBlocker();
});
