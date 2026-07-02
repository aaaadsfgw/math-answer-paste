export function removeThinkBlocks(text) {
  return String(text || "").replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

export function extractBracketAnswer(text) {
  const cleaned = removeThinkBlocks(text);
  const matches = cleaned.match(/\[[^\[\]\r\n]{1,120}\]/g);
  if (!matches || matches.length === 0) {
    return "[不明]";
  }
  return matches[matches.length - 1];
}

export function parseAnswer(rawText) {
  const cleanText = removeThinkBlocks(rawText);
  return {
    answer: extractBracketAnswer(cleanText),
    detail: cleanText
  };
}
