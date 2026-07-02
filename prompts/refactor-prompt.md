# リファクタ用プロンプト

Math Answer Paste をリファクタしてください。

守ること:

- OpenAI APIや外部APIキーは追加しない
- 問題文を外部サーバーへ送信しない
- Ollama API連携は `js/ollama-client.js` に閉じる
- プロンプト生成は `js/prompt-builder.js` に閉じる
- 回答抽出は `js/answer-parser.js` に閉じる
- answerモードは答えだけを1行で返す
- 角括弧を最終表示仕様として復活させない
- API呼び出しでは過去会話を送らず、現在の問題だけを送る
- user message の先頭に `/no_think` を入れる
- Chrome拡張 Manifest V3 の構成を維持する
