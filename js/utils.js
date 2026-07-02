export const OUTPUT_MODES = {
  answer: "答えだけ",
  steps: "途中式つき",
  explain: "簡単な解説つき",
  hint: "ヒントだけ"
};

export function formatDateTime(value) {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function trimQuestion(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

export function setStatus(element, message, type = "neutral") {
  if (!element) return;
  element.textContent = message;
  element.dataset.type = type;
}

export function getQueryParam(name) {
  return new URLSearchParams(location.search).get(name);
}
