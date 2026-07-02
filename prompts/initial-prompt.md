# 初期依頼の要約

Chrome拡張機能として動く「Math Answer Paste」の土台を作成する。数学・情報系の問題文を入力または選択テキストから読み込み、ローカルPC上で動く Ollama の LLM に送り、最終回答を `[ ]` 形式で簡潔に返す。

重要条件:

- Manifest V3
- OpenAI APIやAPIキーは使わない
- Ollama local API を使う
- 初期モデルは実機テスト結果を踏まえて `qwen3:8b`
- 設定画面でモデル名やAPI URLを変更できる
- デモモードを用意する
- 履歴を `chrome.storage.local` に保存する
- README、AGENTS.md、docs、prompts を整える
