import { clearHistory, getHistory } from "./storage.js";
import { formatDateTime, OUTPUT_MODES } from "./utils.js";

const historyList = document.querySelector("#historyList");
const emptyMessage = document.querySelector("#emptyMessage");
const clearHistoryButton = document.querySelector("#clearHistoryButton");

function render(history) {
  historyList.innerHTML = "";
  emptyMessage.hidden = history.length > 0;

  for (const item of history) {
    const card = document.createElement("article");
    card.className = "history-card";
    card.innerHTML = `
      <p class="history-meta">${formatDateTime(item.createdAt)} / ${OUTPUT_MODES[item.mode] || item.mode}</p>
      <h2></h2>
      <p class="history-answer"></p>
    `;
    card.querySelector("h2").textContent = item.question;
    card.querySelector(".history-answer").textContent = item.answer;
    historyList.append(card);
  }
}

render(await getHistory());

clearHistoryButton.addEventListener("click", async () => {
  if (!confirm("履歴をすべて削除しますか？")) return;
  await clearHistory();
  render([]);
});
