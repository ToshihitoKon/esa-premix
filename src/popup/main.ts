import { loadSettings, saveSettings } from "../utils/settings";
import "./style.css";

document.querySelector("#app")!.innerHTML = `
  <div class="popup-header">
    <h1>esa-premix 設定</h1>
  </div>
  <div class="popup-container">
    <div class="setting-item">
      <input type="checkbox" name="subcategory" id="subcategory">
      <label class="control-label">サブカテゴリ機能</label>
      <p class="help-block">記事一覧ページにサブカテゴリの一覧を表示します。</p>
    </div>
    <div class="setting-item">
      <input type="checkbox" name="preview" id="preview">
      <label class="control-label">コンテンツプレビュー機能</label>
      <p class="help-block">esa ページへのリンクの隣に、記事をホバー表示するプレビューボタンを追加します。</p>
    </div>
    <div class="setting-item">
      <input type="checkbox" name="debuglog" id="debuglog">
      <label class="control-label">コンソールへのデバッグログ出力</label>
      <p class="help-block">esa-premix のデバッグログを有効化します。</p>
    </div>
  </div>
`;

// フォーム初期化
async function initializeForm() {
  const settings = await loadSettings();

  const settingSubcategory = document.getElementById(
    "subcategory",
  ) as HTMLInputElement;
  const settingPreview = document.getElementById("preview") as HTMLInputElement;
  const settingDebuglog = document.getElementById(
    "debuglog",
  ) as HTMLInputElement;

  // 初期値設定
  settingSubcategory.checked = settings.subcategory as boolean;
  settingPreview.checked = settings.preview as boolean;
  settingDebuglog.checked = settings.debuglog as boolean;

  // イベントリスナーの設定
  settingSubcategory.addEventListener("change", async () => {
    const newSettings = await loadSettings();
    newSettings.subcategory = settingSubcategory.checked;
    await saveSettings(newSettings);
  });

  settingPreview.addEventListener("change", async () => {
    const newSettings = await loadSettings();
    newSettings.preview = settingPreview.checked;
    await saveSettings(newSettings);
  });

  settingDebuglog.addEventListener("change", async () => {
    const newSettings = await loadSettings();
    newSettings.debuglog = settingDebuglog.checked;
    await saveSettings(newSettings);
  });
}

// DOMContentLoaded後に初期化
document.addEventListener("DOMContentLoaded", initializeForm);
