const TOAST_ID = "math-answer-paste-toast";
let toastTimerId = 0;

function getInputSelectionText() {
  const active = document.activeElement;
  const isTextField = active instanceof HTMLTextAreaElement || active instanceof HTMLInputElement;

  if (!isTextField) return "";
  const start = active.selectionStart ?? 0;
  const end = active.selectionEnd ?? 0;
  if (start === end) return "";
  return active.value.slice(start, end);
}

function getPageSelectionText() {
  const inputSelection = getInputSelectionText();
  if (inputSelection) return inputSelection;

  const selection = window.getSelection();
  return selection ? selection.toString() : "";
}

async function writeClipboardText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to textarea fallback.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    textarea.remove();
  }
  return copied;
}

function getToastColor(type) {
  if (type === "success") return "#16a34a";
  if (type === "error") return "#dc2626";
  if (type === "loading") return "#64748b";
  return "#334155";
}

function showShortcutToast(text, type = "neutral") {
  const existing = document.getElementById(TOAST_ID);
  const toast = existing || document.createElement("div");
  const accent = getToastColor(type);

  toast.id = TOAST_ID;
  toast.textContent = String(text || "");
  toast.setAttribute("role", "status");
  toast.style.position = "fixed";
  toast.style.top = "14px";
  toast.style.right = "14px";
  toast.style.zIndex = "2147483647";
  toast.style.maxWidth = "280px";
  toast.style.padding = "8px 10px";
  toast.style.borderRadius = "10px";
  toast.style.border = "1px solid rgba(148, 163, 184, 0.35)";
  toast.style.borderLeft = `4px solid ${accent}`;
  toast.style.background = "rgba(15, 23, 42, 0.92)";
  toast.style.color = "#f8fafc";
  toast.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  toast.style.fontSize = "12px";
  toast.style.lineHeight = "1.4";
  toast.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.22)";
  toast.style.pointerEvents = "none";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(-4px)";
  toast.style.transition = "opacity 160ms ease, transform 160ms ease";

  if (!existing) {
    document.documentElement.appendChild(toast);
  }

  requestAnimationFrame(() => {
    toast.style.opacity = "0.92";
    toast.style.transform = "translateY(0)";
  });

  clearTimeout(toastTimerId);

  if (type === "loading") {
    toastTimerId = 0;
    return;
  }

  toastTimerId = window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-4px)";
    window.setTimeout(() => {
      if (toast.parentNode && toast.style.opacity === "0") {
        toast.remove();
      }
    }, 180);
  }, 3200);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "PING") {
    sendResponse({ ok: true });
    return;
  }

  if (message?.type === "SHOW_TOAST") {
    showShortcutToast(message.text, message.toastType);
    sendResponse({ ok: true });
    return;
  }

  if (message?.type === "GET_SELECTION_TEXT") {
    sendResponse({ text: getPageSelectionText() });
    return;
  }

  if (message?.type === "GET_SOURCE_TEXT") {
    const selectionText = getPageSelectionText().trim();
    sendResponse({ text: selectionText, source: selectionText ? "selection" : "none" });
    return;
  }

  if (message?.type === "SET_CLIPBOARD_TEXT") {
    (async () => {
      const ok = await writeClipboardText(String(message.text || ""));
      sendResponse({ ok });
    })();
    return true;
  }
});
