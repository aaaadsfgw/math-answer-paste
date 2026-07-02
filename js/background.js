chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("settings").then((data) => {
    if (data.settings) return;
    chrome.storage.local.set({
      settings: {
        modelName: "qwen3:8b",
        apiUrl: "http://localhost:11434/api/chat",
        defaultMode: "answer",
        demoMode: true,
        saveHistory: true
      }
    });
  });
});
