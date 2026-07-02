import { OUTPUT_MODES } from "./utils.js";

export function buildSystemPrompt(mode) {
  const modeLabel = OUTPUT_MODES[mode] || OUTPUT_MODES.answer;
  const base = [
    "あなたは数学・情報系問題の回答抽出エンジンです。",
    "ユーザーの問題文を読み、最終回答を必ず角括弧 [ ] 形式で返してください。",
    "不明な場合は [不明] と返してください。",
    "DeepSeek-R1系の思考タグは最終回答に含めないでください。",
    `現在の出力モード: ${modeLabel}`
  ];

  if (mode === "answer") {
    return [
      ...base,
      "説明は禁止です。答えだけを短く返してください。",
      "出力例: [4] / [x=4] / [2,3] / [ウ] / [不明]"
    ].join("\n");
  }

  if (mode === "hint") {
    return [
      ...base,
      "答えを直接出さず、解き方のヒントだけを短く示してください。",
      "最後の行に必ず `最終回答: [ヒントのみ]` を含めてください。"
    ].join("\n");
  }

  return [
    ...base,
    "必要な途中式または簡単な解説を示してください。",
    "最後の行に必ず `最終回答: [答え]` を含めてください。"
  ].join("\n");
}

export function buildChatMessages(question, mode) {
  return [
    { role: "system", content: buildSystemPrompt(mode) },
    { role: "user", content: question }
  ];
}
