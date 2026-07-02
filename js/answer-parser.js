export function removeThinkBlocks(text) {
  return String(text || "").replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

function stripOuterBrackets(text) {
  const trimmed = String(text || "").trim();
  const match = trimmed.match(/^\[([^\[\]]+)\]$/);
  return match ? match[1].trim() : trimmed;
}

export function extractFinalAnswer(text) {
  const cleaned = removeThinkBlocks(text);
  const lines = cleaned
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return "不明";
  }

  const finalLine = lines[lines.length - 1];
  const labelMatch = finalLine.match(/最終回答\s*[:：]\s*(.+)$/);
  const answer = labelMatch ? labelMatch[1] : finalLine;
  return stripOuterBrackets(answer) || "不明";
}

export function parseAnswer(rawText) {
  const cleanText = removeThinkBlocks(rawText);
  return {
    answer: extractFinalAnswer(cleanText),
    detail: cleanText
  };
}
