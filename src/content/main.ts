import { initCategoryFiler } from "./categoryFiler.ts";
import { initPreviewWindow } from "./preview.ts";
import { log } from "../utils/log.ts";
import "../styles/content.css";

/**
 * 拡張機能のメインエントリポイント
 */
async function initEsaPremix(): Promise<void> {
  try {
    log("Starting initialization");

    // ファイラー型カテゴリ表示を初期化
    await initCategoryFiler(window.location.hash);

    // プレビューペイン機能を初期化
    initPreviewWindow();

    log("Initialization completed");
  } catch (error) {
    console.error("esa-premix: Initialization failed:", error);
  }
}

/**
 * DOMの読み込み完了を待機してから初期化
 */
function waitForDOMReady(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => resolve());
    } else {
      resolve();
    }
  });
}

/**
 * メイン処理
 */
async function main() {
  // DOMの準備完了を待つ
  await waitForDOMReady();

  // 初回の初期化
  await initEsaPremix();
}

chrome.runtime.onMessage.addListener(
  (message: any, _sender, sendResponse): boolean => {
    (async () => {
      try {
        if (!message.url) {
          sendResponse({ success: false });
        }
        log(
          "Received message to reinitialize category filer with URL:" +
            message.url,
        );
        await initCategoryFiler(message.url);
        await initPreviewWindow();
        sendResponse({ success: true });
      } catch (error) {
        console.error("Failed to initialize category filer:", error);
        sendResponse({ success: false });
      }
    })();
    return true; // 非同期レスポンスを示す
  },
);

// 実行開始
main();
