// Initialize custom features when DOM is ready
function initCustomFeatures() {
  // Add click handlers to anchor links
  function addAnchorHandlers() {
    document.querySelectorAll('a.hash-link').forEach((anchor) => {
      if (anchor.dataset.copyHandlerAdded) return;

      anchor.addEventListener("click", (e) => {
        const url =
          window.location.href.split("#")[0] + anchor.getAttribute("href");
        setTimeout(() => {
          navigator.clipboard
            .writeText(url)
            .then(() =>
              showCopyNotification("Link copied !", e.clientX, e.clientY)
            )
            .catch((err) => console.error("Failed to copy link:", err));
        }, 100);
      });

      anchor.dataset.copyHandlerAdded = "true";
    });
  }

  // Add handlers initially and watch for content changes
  addAnchorHandlers();

  new MutationObserver((mutations) => {
    if (
      mutations.some((m) => m.type === "childList" && m.addedNodes.length > 0)
    ) {
      setTimeout(addAnchorHandlers, 100);
    }
  }).observe(document.body, { childList: true, subtree: true });
}

// Show temporary notification message at click position
function showCopyNotification(message, x, y) {
  const notification = document.createElement("div");
  notification.textContent = message;

  // Position under the click with some offset
  const offsetX = 10;
  const offsetY = 20;

  // Use theme colors - check if dark mode is active
  const isDarkMode =
    document.documentElement.getAttribute("data-theme") === "dark";

  const bgColor = isDarkMode
    ? "rgba(255, 255, 255, 0.15)"
    : "rgba(0, 0, 0, 0.75)";
  const textColor = isDarkMode
    ? "rgba(255, 255, 255, 0.9)"
    : "rgba(255, 255, 255, 0.95)";
  const borderColor = isDarkMode
    ? "rgba(255, 255, 255, 0.25)"
    : "rgba(255, 255, 255, 0.2)";

  notification.style.cssText = `
    position: fixed;
    left: ${x + offsetX}px;
    top: ${y + offsetY}px;
    background: ${bgColor};
    color: ${textColor};
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid ${borderColor};
    z-index: 1000;
    font-size: 12px;
    font-weight: 500;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    pointer-events: none;
    white-space: nowrap;
    opacity: 0;
    transform: translateY(-5px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  `;

  document.body.appendChild(notification);

  // Ensure notification stays within viewport
  const rect = notification.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    notification.style.left = `${x - rect.width - offsetX}px`;
  }
  if (rect.bottom > window.innerHeight) {
    notification.style.top = `${y - rect.height - offsetY}px`;
  }

  // Fade in animation
  requestAnimationFrame(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";
  });

  // Fade out and remove
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-5px)";
    setTimeout(() => notification.remove(), 200);
  }, 500);
}

// Initialize when DOM is ready
document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", initCustomFeatures)
  : initCustomFeatures();
