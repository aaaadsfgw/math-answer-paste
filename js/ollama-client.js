import { buildChatMessages } from "./prompt-builder.js";

export async function askOllama({ apiUrl, modelName, question, mode }) {
  const body = {
    model: modelName,
    stream: false,
    messages: buildChatMessages(question, mode)
  };

  let response;
  try {
    response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  } catch (error) {
    throw new Error(`Ollamaに接続できません。起動状態、API URL、ネットワーク許可を確認してください。詳細: ${error.message}`);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Ollama APIがエラーを返しました。モデル未インストールまたはURL設定を確認してください。HTTP ${response.status} ${text}`);
  }

  const data = await response.json();
  return data?.message?.content || data?.response || "";
}
