import { setPendingQuestion } from "./storage.js";

const examples = [
  {
    title: "一次方程式",
    question: "2x + 3 = 11 を解きなさい。",
    expected: "[x=4]"
  },
  {
    title: "2進数変換",
    question: "1011(2)を10進数に変換しなさい。",
    expected: "[11]"
  },
  {
    title: "割合",
    question: "800円の25%はいくらですか。",
    expected: "[200]"
  },
  {
    title: "選択肢",
    question: "1011(2)を10進数に変換。ア 9 イ 10 ウ 11 エ 12",
    expected: "[ウ]"
  }
];

const grid = document.querySelector("#examplesGrid");

for (const example of examples) {
  const card = document.createElement("button");
  card.className = "example-card";
  card.type = "button";
  card.innerHTML = `<h2></h2><p></p><strong></strong>`;
  card.querySelector("h2").textContent = example.title;
  card.querySelector("p").textContent = example.question;
  card.querySelector("strong").textContent = example.expected;
  card.addEventListener("click", async () => {
    await setPendingQuestion(example.question);
    location.href = "popup.html";
  });
  grid.append(card);
}
