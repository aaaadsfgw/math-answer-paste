# 初期依頼の要約

Chrome拡張機能として動く「Math Answer Paste」の土台を作成する。数学・情報系の問題文を入力または選択テキストから読み込み、ローカルPC上で動く Ollama の LLM に送り、最終回答をコピーしやすい形で返す。

現在の最終仕様:

- Manifest V3
- OpenAI APIやAPIキーは使わない
- Ollama local API を使う
- 初期モデルは実機テスト結果を踏まえて `qwen3:8b`
- user message の先頭に `/no_think` を入れる
- API呼び出しでは過去会話を送らず、毎回現在の問題だけを送る
- 答えは角括弧なしの1行で表示・コピーする
- 設定画面でモデル名やAPI URLを変更できる
- デモモードを用意する
- 履歴を `chrome.storage.local` に保存する
- README、AGENTS.md、docs、prompts を整える
