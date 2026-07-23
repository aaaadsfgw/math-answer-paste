import { askOllama } from "./ollama-client.js";
import { parseAnswer } from "./answer-parser.js";
import { solveDemo } from "./demo-solver.js";
import { addHistory, getSettings } from "./storage.js";
import { trimQuestion } from "./utils.js";

const DEFAULT_SETTINGS = {
  modelName: "qwen3:8b",
  apiUrl: "http://localhost:11434/api/chat",
  defaultMode: "answer",
  demoMode: false,
  saveHistory: true
};

const COMMAND_SOLVE_SELECTION = "solve-selection-to-clipboard";
const BADGE_RESET_MS = 2500;

async function ensureDefaultSettings() {
  const data = await chrome.storage.local.get("settings");
  if (data.settings) return;
  await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
}

chrome.runtime.onInstalled.addListener(() => {
  ensureDefaultSettings();
});

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error("アクティブなタブを取得できませんでした。");
  }
  return tab;
}

async function sendTabMessage(tabId, message) {
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["js/content-script.js"]
    });
    return chrome.tabs.sendMessage(tabId, message);
  }
}

async function getSourceText(tabId) {
  const response = await sendTabMessage(tabId, { type: "GET_SOURCE_TEXT" });
  const text = trimQuestion(response?.text || "");
  if (!text) {
    throw new Error("問題文が見つかりません。ページ上で問題文を選択してから Ctrl+Shift+Y を押してください。");
  }
  return text;
}

async function copyAnswerToTab(tabId, answer) {
  const response = await sendTabMessage(tabId, { type: "SET_CLIPBOARD_TEXT", text: answer });
  if (!response?.ok) {
    throw new Error("回答をクリップボードにコピーできませんでした。");
  }
}

async function setBadge(text, color) {
  await chrome.action.setBadgeText({ text });
  if (color) {
    await chrome.action.setBadgeBackgroundColor({ color });
  }
  setTimeout(() => {
    chrome.action.setBadgeText({ text: "" });
  }, BADGE_RESET_MS);
}

async function solveWithSettings(question, settings) {
  const mode = "answer";
  const rawText = settings.demoMode
    ? solveDemo(question, mode)
    : await askOllama({ apiUrl: settings.apiUrl, modelName: settings.modelName, question, mode });
  const parsed = parseAnswer(rawText);
  return { rawText, answer: parsed.answer };
}

async function handleSolveSelectionShortcut() {
  const tab = await getActiveTab();
  await setBadge("...", "#64748b");

  const question = await getSourceText(tab.id);
  const settings = await getSettings();
  const { rawText, answer } = await solveWithSettings(question, settings);

  await copyAnswerToTab(tab.id, answer);

  if (settings.saveHistory) {
    await addHistory({ question, mode: "answer", answer, detail: rawText, source: "shortcut" });
  }

  await setBadge("OK", "#16a34a");
}

chrome.commands.onCommand.addListener((command) => {
  if (command !== COMMAND_SOLVE_SELECTION) return;

  handleSolveSelectionShortcut().catch((error) => {
    console.error(error);
    setBadge("ERR", "#dc2626");
  });
});
