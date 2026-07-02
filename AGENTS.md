# AGENTS.md

## プロジェクトの目的

Math Answer Paste は、数学・情報系の問題文をローカルの Ollama に送り、最終回答を `[ ]` 形式で取り出す Chrome 拡張です。

## Chrome拡張としての注意点

- Manifest V3 を維持します。
- `popup.html` を主画面にします。
- `background.js` は service worker として軽量に保ちます。
- content script は選択テキスト取得に限定します。

## Ollama API連携の注意点

- 既定URLは `http://localhost:11434/api/chat` です。
- `stream: false` を使います。
- fetch失敗時は、Ollama未起動、モデル未インストール、URL誤りを疑えるメッセージにします。

## APIキーを使わない方針

外部のOpenAI APIやクラウドAI APIは使いません。APIキー、トークン、秘密情報をファイルに書き込まないでください。

## 問題文を外部送信しない方針

問題文はユーザーのPC上で動作する Ollama にのみ送信します。外部サーバーへの送信処理を追加しないでください。

## ファイル分割方針

- `js/prompt-builder.js`: Ollamaへ送る指示文
- `js/ollama-client.js`: Ollama API通信
- `js/answer-parser.js`: `<think>` 除去と `[ ]` 抽出
- `js/demo-solver.js`: デモモード
- `js/storage.js`: 設定と履歴
- `js/clipboard.js`: コピー処理

## 命名規則

- HTML ID は意味が分かる camelCase にします。
- JS の関数名は動詞から始めます。
- CSS class は kebab-case にします。

## 回答形式ルール

答えだけモードでは必ず `[4]`、`[x=4]`、`[2,3]`、`[ウ]`、`[不明]` のように角括弧形式を守ります。途中式・解説モードでも最後の行に `最終回答: [答え]` を含めます。

## テスト確認項目

- Chromeで拡張を読み込める
- ポップアップが開く
- デモモードで固定例が返る
- Ollamaモードで `POST /api/chat` が呼べる
- `<think>...</think>` が表示用結果から除去される
- `[ ]` の最後の回答を抽出できる
- コピーできる
- 履歴保存と削除ができる
- 設定が保存される
