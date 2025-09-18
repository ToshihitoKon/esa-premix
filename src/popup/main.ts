import "./style.css";

interface Settings {
  subcategory: boolean;
  preview: boolean;
}

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
  </div>
`;

// 設定の読み込み
async function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["subcategory", "preview"], (result) => {
      resolve({
        subcategory: result.subcategory ?? true,
        preview: result.preview ?? true,
      });
    });
  });
}

// 設定の保存
async function saveSettings(settings: Settings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, () => {
      resolve();
    });
  });
}

// フォーム初期化
async function initializeForm() {
  const settings = await loadSettings();

  const settingSubcategory = document.getElementById(
    "subcategory",
  ) as HTMLInputElement;
  const settingPreview = document.getElementById("preview") as HTMLInputElement;

  // 初期値設定
  settingSubcategory.checked = settings.subcategory as boolean;
  settingPreview.checked = settings.preview as boolean;

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
}

// DOMContentLoaded後に初期化
document.addEventListener("DOMContentLoaded", initializeForm);
