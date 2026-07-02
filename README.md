# Math Answer Paste

Math Answer Paste は、数学・情報系の問題文をローカルPC上の Ollama に送り、最終回答を `[ ]` 形式でコピーしやすくする Chrome 拡張機能です。

## 概要

- 問題文を入力、またはブラウザ上の選択テキストから読み込みます。
- ローカルの Ollama API `http://localhost:11434/api/chat` にだけ送信します。
- OpenAI API や外部APIキーは使いません。
- DeepSeek-R1 系の `<think>...</think>` は表示用の結果から除去します。
- Ollama が使えない環境でも試せるデモモードを用意しています。

## 作成目的

提出課題や学習用途で、計算問題・情報系の基本問題の答えを短い `[ ]` 形式で扱えるようにするための土台です。

## 使用技術

- Chrome Extension Manifest V3
- HTML / CSS / JavaScript
- chrome.storage.local
- Ollama local API

## Chrome拡張の読み込み方法

1. Chromeで `chrome://extensions/` を開きます。
2. 右上の「デベロッパーモード」をONにします。
3. 「パッケージ化されていない拡張機能を読み込む」を押します。
4. この `math-answer-paste` フォルダを選びます。

## Ollamaのインストールと起動方法

Ollama をインストールした後、ターミナルで次を実行します。

```bash
ollama serve
ollama pull qwen3:8b
ollama run qwen3:8b
```

## 推奨モデル

1. `qwen3:8b`
   - RTX 4060 VRAM 8GB 環境で、回答精度と速度のバランスが良かったため第一候補です。
2. `deepseek-r1:14b`
   - 精度重視の候補です。正答できる一方、CPU/GPU混在でやや重くなる可能性があります。
3. `deepseek-r1:8b`
   - 軽量候補ですが、環境によってはGPU 100%でも回答が遅い場合があります。

## 主な機能

- 問題入力
- 選択テキスト読み込み
- 出力モード切り替え
- Ollama連携
- デモモード
- `[ ]` 形式の回答抽出
- クリップボードコピー
- 履歴保存と削除
- 設定保存

## 画面一覧

- `popup.html`: 問題入力、解析、結果コピー
- `history.html`: 履歴一覧、削除
- `settings.html`: モデル名、API URL、モード、デモ、履歴保存の設定
- `examples.html`: 対応例
- `help.html`: 使い方とOllama起動方法
- `about.html`: システム概要と注意事項

## ディレクトリ構成

```text
math-answer-paste/
  manifest.json
  popup.html
  history.html
  settings.html
  examples.html
  help.html
  about.html
  css/
  js/
  docs/
  prompts/
  AGENTS.md
  README.md
```

## データ保存方法

設定と履歴は `chrome.storage.local` に保存します。ブラウザ外でHTMLを直接開いた場合の確認用に、一部処理は `localStorage` にフォールバックします。

## Ollama連携の仕組み

`js/ollama-client.js` が `fetch` で `POST /api/chat` を呼び出します。送信する内容は、設定画面のモデル名、`stream: false`、`system` と `user` のメッセージです。

## デモモードについて

Ollamaが起動していなくても、次の固定例はローカルJavaScriptだけで回答します。

- `2x + 3 = 11` -> `[x=4]`
- `1011(2)を10進数に変換` -> `[11]`
- `800円の25%` -> `[200]`
- `1011(2)` と選択肢 `ア 9 イ 10 ウ 11 エ 12` -> `[ウ]`

## よくあるエラー

- 接続できない: `ollama serve` が起動しているか確認してください。
- モデルがない: `ollama pull モデル名` を実行してください。
- 返答が遅い: `qwen3:8b` を第一候補として試し、用途に応じて別モデルも比較してください。

## AI活用ポイント

この拡張はクラウドAIではなくローカルLLMを使います。問題文を外部送信しない設計にし、APIキーや秘密情報をリポジトリへ置かない方針です。

## 今後の改善案

- 回答の信頼度表示
- 対応問題のデモ追加
- 履歴検索
- キーボードショートカット
- 設定のエクスポート
