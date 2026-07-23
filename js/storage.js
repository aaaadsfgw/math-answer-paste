export const DEFAULT_SETTINGS = {
  modelName: "qwen3:8b",
  apiUrl: "http://localhost:11434/api/chat",
  defaultMode: "answer",
  demoMode: false,
  saveHistory: true
};

const SETTINGS_KEY = "settings";
const HISTORY_KEY = "history";
const PENDING_QUESTION_KEY = "pendingQuestion";

function canUseChromeStorage() {
  return typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;
}

function localGet(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : undefined;
}

function localSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function getSettings() {
  if (canUseChromeStorage()) {
    const data = await chrome.storage.local.get(SETTINGS_KEY);
    return { ...DEFAULT_SETTINGS, ...(data[SETTINGS_KEY] || {}) };
  }
  return { ...DEFAULT_SETTINGS, ...(localGet(SETTINGS_KEY) || {}) };
}

export async function saveSettings(settings) {
  const next = { ...DEFAULT_SETTINGS, ...settings };
  if (canUseChromeStorage()) {
    await chrome.storage.local.set({ [SETTINGS_KEY]: next });
    return next;
  }
  localSet(SETTINGS_KEY, next);
  return next;
}

export async function getHistory() {
  if (canUseChromeStorage()) {
    const data = await chrome.storage.local.get(HISTORY_KEY);
    return data[HISTORY_KEY] || [];
  }
  return localGet(HISTORY_KEY) || [];
}

export async function addHistory(entry) {
  const history = await getHistory();
  const next = [{ id: crypto.randomUUID(), createdAt: Date.now(), ...entry }, ...history].slice(0, 100);
  if (canUseChromeStorage()) {
    await chrome.storage.local.set({ [HISTORY_KEY]: next });
    return next;
  }
  localSet(HISTORY_KEY, next);
  return next;
}

export async function clearHistory() {
  if (canUseChromeStorage()) {
    await chrome.storage.local.set({ [HISTORY_KEY]: [] });
    return;
  }
  localSet(HISTORY_KEY, []);
}

export async function setPendingQuestion(question) {
  if (canUseChromeStorage()) {
    await chrome.storage.local.set({ [PENDING_QUESTION_KEY]: question });
    return;
  }
  localSet(PENDING_QUESTION_KEY, question);
}

export async function consumePendingQuestion() {
  if (canUseChromeStorage()) {
    const data = await chrome.storage.local.get(PENDING_QUESTION_KEY);
    await chrome.storage.local.remove(PENDING_QUESTION_KEY);
    return data[PENDING_QUESTION_KEY] || "";
  }
  const value = localGet(PENDING_QUESTION_KEY) || "";
  localStorage.removeItem(PENDING_QUESTION_KEY);
  return value;
}
