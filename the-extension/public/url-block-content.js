// Content script to block URLs and show unicorn page
(function () {
  "use strict";

  let blockedUrls = [];
  let isBlocked = false;

  // Load blocked URLs from storage
  async function loadBlockedUrls() {
    try {
      if (!chrome.storage || !chrome.storage.sync) {
        throw new Error("chrome.storage.sync is not available");
      }
      const result = await chrome.storage.sync.get(["blockedUrls"]);
      blockedUrls = result.blockedUrls || [];
      checkCurrentUrl();
    } catch (error) {
      console.error("Error loading blocked URLs:", error);
    }
  }

  // Normalize URL for comparison
  function normalizeUrl(url) {
    return url
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "");
  }

  // Check if current URL should be blocked
  function checkCurrentUrl() {
    const currentUrl = normalizeUrl(window.location.href);
    const hostname = normalizeUrl(window.location.hostname);

    // Check if current URL or hostname matches any blocked URL
    const shouldBlock = blockedUrls.some((blockedUrl) => {
      return currentUrl.includes(blockedUrl) || hostname.includes(blockedUrl);
    });

    if (shouldBlock && !isBlocked) {
      blockPage();
    }
  }

  // Block the page and show unicorn
  function blockPage() {
    isBlocked = true;

    // Hide all content
    document.documentElement.style.display = "none";

    // Create blocked page overlay
    const blockedOverlay = document.createElement("div");
    blockedOverlay.id = "url-blocked-overlay";
    blockedOverlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                color: white;
                text-align: center;
                overflow: hidden;
            ">
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 30px;
                    padding: 3rem;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    max-width: 500px;
                    margin: 2rem;
                    animation: bounceIn 0.8s ease-out;
                ">
                    <div style="font-size: 8rem; margin-bottom: 1rem; animation: float 3s ease-in-out infinite;">
                        🦄
                    </div>
                    <h1 style="
                        font-size: 2.5rem; 
                        margin-bottom: 1rem; 
                        font-weight: 700;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    ">
                        Site Blocked!
                    </h1>
                    <p style="
                        font-size: 1.2rem; 
                        margin-bottom: 1.5rem; 
                        opacity: 0.9;
                        line-height: 1.6;
                    ">
                        This website is blocked to help you stay focused.<br>
                        Time to get back to work! 💪
                    </p>
                    <div style="
                        font-size: 1rem; 
                        background: rgba(255, 255, 255, 0.2); 
                        padding: 1rem; 
                        border-radius: 15px;
                        margin-bottom: 1.5rem;
                        font-family: Monaco, Consolas, monospace;
                    ">
                        Blocked URL: ${window.location.hostname}
                    </div>
                    <button id="goBackBtn" style="
                        background: rgba(255, 255, 255, 0.2);
                        border: 2px solid rgba(255, 255, 255, 0.3);
                        color: white;
                        padding: 1rem 2rem;
                        border-radius: 15px;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        backdrop-filter: blur(5px);
                    " 
                    onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='translateY(-2px)'"
                    onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='translateY(0)'"
                    onclick="history.back()">
                        ← Go Back
                    </button>
                </div>
                
                <!-- Floating particles -->
                <div style="position: absolute; top: 10%; left: 10%; font-size: 2rem; animation: float 4s ease-in-out infinite;">✨</div>
                <div style="position: absolute; top: 20%; right: 15%; font-size: 1.5rem; animation: float 3s ease-in-out infinite 1s;">🌟</div>
                <div style="position: absolute; bottom: 20%; left: 20%; font-size: 1.8rem; animation: float 3.5s ease-in-out infinite 2s;">💫</div>
                <div style="position: absolute; bottom: 30%; right: 10%; font-size: 2.2rem; animation: float 4.5s ease-in-out infinite 0.5s;">⭐</div>
            </div>
            
            <style>
                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                #url-blocked-overlay * {
                    box-sizing: border-box;
                }
            </style>
        `;

    // Insert at the beginning of body or create body if it doesn't exist
    if (document.body) {
      document.body.insertBefore(blockedOverlay, document.body.firstChild);
    } else {
      document.documentElement.appendChild(blockedOverlay);
    }

    // Prevent any scrolling
    document.documentElement.style.overflow = "hidden";
    document.body && (document.body.style.overflow = "hidden");
  }

  // Listen for URL changes in SPAs
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (!isBlocked) {
        checkCurrentUrl();
      }
    }
  }).observe(document, { subtree: true, childList: true });

  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.blockedUrls) {
      blockedUrls = changes.blockedUrls.newValue || [];
      if (!isBlocked) {
        checkCurrentUrl();
      }
    }
  });

  // Initialize
  loadBlockedUrls();

  // Handle navigation events
  window.addEventListener("popstate", () => {
    if (!isBlocked) {
      setTimeout(checkCurrentUrl, 100);
    }
  });

  // Also check when page fully loads
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(checkCurrentUrl, 100);
    });
  } else {
    setTimeout(checkCurrentUrl, 100);
  }
})();
