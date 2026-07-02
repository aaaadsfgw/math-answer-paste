export function solveDemo(question, mode = "answer") {
  const text = String(question || "").replace(/\s+/g, "");
  let answer = "デモ未対応";

  if (/2x\+3=11/.test(text)) {
    answer = "x=4";
  } else if (/1011\(2\).*(10進数|10進|変換)/.test(text)) {
    answer = /ア9イ10ウ11エ12/.test(text) ? "ウ" : "11";
  } else if (/800円.*25%/.test(text) || /800.*25%/.test(text)) {
    answer = "200";
  }

  if (mode === "steps") {
    return `デモ計算です。\n条件に合う固定例を照合しました。\n最終回答: ${answer}`;
  }

  if (mode === "explain") {
    return `デモモードでは登録済みの例題のみ回答します。\n最終回答: ${answer}`;
  }

  if (mode === "hint") {
    return "式や選択肢の対応関係を確認してください。\n最終回答: ヒントのみ";
  }

  return answer;
}
