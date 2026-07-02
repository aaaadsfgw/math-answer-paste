# リファクタ用プロンプト

Math Answer Paste をリファクタしてください。

守ること:

- OpenAI APIや外部APIキーは追加しない
- 問題文を外部サーバーへ送信しない
- Ollama API連携は `js/ollama-client.js` に閉じる
- プロンプト生成は `js/prompt-builder.js` に閉じる
- 回答抽出は `js/answer-parser.js` に閉じる
- 答えだけモードの `[ ]` 形式を崩さない
- Chrome拡張 Manifest V3 の構成を維持する
