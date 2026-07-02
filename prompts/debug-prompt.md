# バグ修正用プロンプト

Math Answer Paste の不具合を修正してください。

確認する観点:

- Chrome拡張 Manifest V3 として読み込めるか
- `chrome.storage.local` のキーが壊れていないか
- Ollama API URL とモデル名が設定通り使われているか
- fetch失敗時のエラーが分かりやすいか
- `<think>...</think>` が表示結果から除去されているか
- 最後の `[ ]` が正しく抽出されているか
- デモモードが固定例に正しく反応するか
- APIキーや外部送信処理が混入していないか
