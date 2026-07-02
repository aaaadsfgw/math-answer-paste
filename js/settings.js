import { DEFAULT_SETTINGS, getSettings, saveSettings } from "./storage.js";
import { setStatus } from "./utils.js";

const form = document.querySelector("#settingsForm");
const modelName = document.querySelector("#modelName");
const apiUrl = document.querySelector("#apiUrl");
const defaultMode = document.querySelector("#defaultMode");
const demoMode = document.querySelector("#demoMode");
const saveHistory = document.querySelector("#saveHistory");
const resetButton = document.querySelector("#resetButton");
const settingsStatus = document.querySelector("#settingsStatus");

function fill(settings) {
  modelName.value = settings.modelName;
  apiUrl.value = settings.apiUrl;
  defaultMode.value = settings.defaultMode;
  demoMode.checked = settings.demoMode;
  saveHistory.checked = settings.saveHistory;
}

fill(await getSettings());

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveSettings({
    modelName: modelName.value.trim() || DEFAULT_SETTINGS.modelName,
    apiUrl: apiUrl.value.trim() || DEFAULT_SETTINGS.apiUrl,
    defaultMode: defaultMode.value,
    demoMode: demoMode.checked,
    saveHistory: saveHistory.checked
  });
  setStatus(settingsStatus, "保存しました。", "success");
});

resetButton.addEventListener("click", async () => {
  fill(await saveSettings(DEFAULT_SETTINGS));
  setStatus(settingsStatus, "初期値に戻しました。", "success");
});
