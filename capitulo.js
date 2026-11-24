function selectButton(buttons, selected) {
  for (const button of buttons)
    button.setAttribute("aria-pressed", String(button === selected));
}

if (window.parent !== window) {
  const chapterContent = document.querySelector("main");

  function sendHeight() {
    const height = Math.max(
      chapterContent.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );
    window.parent.postMessage({ type: "chapter-height", height }, "*");
  }

  const observer = new ResizeObserver(sendHeight);
  observer.observe(chapterContent);

  window.addEventListener("message", (event) => {
    if (event.source !== window.parent || event.data?.type !== "viewport")
      return;
    if (event.data.presenting) {
      document.body.style.setProperty(
        "--chapter-height",
        event.data.height + "px",
      );
      document.body.style.removeProperty("--chapter-panel-height");
    } else {
      document.body.style.removeProperty("--chapter-height");
      document.body.style.setProperty(
        "--chapter-panel-height",
        event.data.height + "px",
      );
    }
    document.body.classList.toggle(
      "presenting",
      Boolean(event.data.presenting),
    );
    document.body.classList.toggle("reading", !event.data.presenting);
    sendHeight();
  });

  document.addEventListener("keydown", (event) => {
    if (document.querySelector("dialog[open]")) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    if (event.target.closest?.("input, textarea, select, [contenteditable]"))
      return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft")
      event.preventDefault();
    if (
      ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)
    ) {
      window.parent.postMessage({ type: "chapter-key", key: event.key }, "*");
    }
  });

  for (const link of document.querySelectorAll("[data-go]")) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.parent.postMessage(
        { type: "chapter-link", id: link.dataset.go },
        "*",
      );
    });
  }
} else {
  document.querySelector(".back-to-deck").hidden = false;
}
