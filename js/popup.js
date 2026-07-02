import { askOllama } from "./ollama-client.js";
import { parseAnswer } from "./answer-parser.js";
import { solveDemo } from "./demo-solver.js";
import { copyText } from "./clipboard.js";
import { addHistory, consumePendingQuestion, getSettings } from "./storage.js";
import { setStatus, trimQuestion } from "./utils.js";

const questionInput = document.querySelector("#questionInput");
const modeSelect = document.querySelector("#modeSelect");
const solveButton = document.querySelector("#solveButton");
const loadSelectionButton = document.querySelector("#loadSelectionButton");
const copyButton = document.querySelector("#copyButton");
const answerOutput = document.querySelector("#answerOutput");
const detailOutput = document.querySelector("#detailOutput");
const statusMessage = document.querySelector("#statusMessage");
const runtimeBadge = document.querySelector("#runtimeBadge");

let latestAnswer = "";
let settings = await getSettings();

modeSelect.value = settings.defaultMode;
runtimeBadge.textContent = settings.demoMode ? "デモモード" : "Ollama";

const pendingQuestion = await consumePendingQuestion();
if (pendingQuestion) {
  questionInput.value = pendingQuestion;
}

async function loadSelectedText() {
  if (typeof chrome === "undefined" || !chrome.tabs) {
    setStatus(statusMessage, "選択テキストの取得はChrome拡張として読み込んだ時に使えます。", "error");
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: "GET_SELECTION_TEXT" });
    if (response?.text) {
      questionInput.value = response.text.trim();
      setStatus(statusMessage, "選択テキストを読み込みました。", "success");
    } else {
      setStatus(statusMessage, "選択中のテキストが見つかりません。手動で貼り付けてください。", "neutral");
    }
  } catch {
    setStatus(statusMessage, "このページでは選択テキストを取得できません。手動で貼り付けてください。", "error");
  }
}

function renderResult(parsed, rawText) {
  latestAnswer = parsed.answer;
  answerOutput.textContent = parsed.answer;
  copyButton.disabled = false;
  detailOutput.textContent = rawText;
  detailOutput.classList.toggle("has-detail", modeSelect.value !== "answer");
}

async function solveQuestion() {
  const question = trimQuestion(questionInput.value);
  const mode = modeSelect.value;

  if (!question) {
    setStatus(statusMessage, "問題文を入力してください。", "error");
    return;
  }

  solveButton.disabled = true;
  copyButton.disabled = true;
  setStatus(statusMessage, "解析中です。", "neutral");

  try {
    const rawText = settings.demoMode
      ? solveDemo(question, mode)
      : await askOllama({ apiUrl: settings.apiUrl, modelName: settings.modelName, question, mode });
    const parsed = parseAnswer(rawText);
    renderResult(parsed, rawText);

    if (settings.saveHistory) {
      await addHistory({ question, mode, answer: parsed.answer, detail: rawText });
    }
    setStatus(statusMessage, "最終回答を作成しました。", "success");
  } catch (error) {
    latestAnswer = "";
    answerOutput.textContent = "エラー";
    detailOutput.textContent = "";
    detailOutput.classList.remove("has-detail");
    setStatus(statusMessage, error.message, "error");
  } finally {
    solveButton.disabled = false;
  }
}

loadSelectionButton.addEventListener("click", loadSelectedText);
solveButton.addEventListener("click", solveQuestion);
copyButton.addEventListener("click", async () => {
  await copyText(latestAnswer);
  setStatus(statusMessage, "コピーしました。", "success");
});
