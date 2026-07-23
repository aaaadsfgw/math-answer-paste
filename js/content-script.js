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

async function readClipboardText() {
  try {
    if (!navigator.clipboard?.readText) return "";
    return await navigator.clipboard.readText();
  } catch {
    return "";
  }
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "PING") {
    sendResponse({ ok: true });
    return;
  }

  if (message?.type === "GET_SELECTION_TEXT") {
    sendResponse({ text: getPageSelectionText() });
    return;
  }

  if (message?.type === "GET_SOURCE_TEXT") {
    (async () => {
      const selectionText = getPageSelectionText().trim();
      if (selectionText) {
        sendResponse({ text: selectionText, source: "selection" });
        return;
      }

      const clipboardText = (await readClipboardText()).trim();
      sendResponse({ text: clipboardText, source: clipboardText ? "clipboard" : "none" });
    })();
    return true;
  }

  if (message?.type === "SET_CLIPBOARD_TEXT") {
    (async () => {
      const ok = await writeClipboardText(String(message.text || ""));
      sendResponse({ ok });
    })();
    return true;
  }
});
