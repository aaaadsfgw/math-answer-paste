chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "GET_SELECTION_TEXT") return;
  const selection = window.getSelection();
  sendResponse({ text: selection ? selection.toString() : "" });
});
