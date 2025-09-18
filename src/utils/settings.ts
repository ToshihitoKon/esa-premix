interface Settings {
  subcategory: boolean;
  preview: boolean;
  debuglog: boolean;
}

// 設定の読み込み
export async function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      ["subcategory", "preview", "debuglog"],
      (result) => {
        resolve({
          subcategory: result.subcategory ?? true,
          preview: result.preview ?? true,
          debuglog: result.debuglog ?? false,
        });
      },
    );
  });
}

// 設定の保存
export async function saveSettings(settings: Settings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, () => {
      resolve();
    });
  });
}
