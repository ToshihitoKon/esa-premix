import { initCategoryFiler } from "./categoryFiler.ts";
import { initPreviewWindow } from "./preview.ts";
import { log } from "../utils/log.ts";
import "../styles/content.css";
import { loadSettings } from "../utils/settings.ts";

async function initEsaPremix(): Promise<void> {
  try {
    log("Starting initialization");

    const settings = await loadSettings();

    if (settings.subcategory) {
      await initCategoryFiler(window.location.hash);
    }

    if (settings.preview) {
      initPreviewWindow();
    }

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
 * メッセージハンドラ: URLが変更された際の再初期化処理
 */
function handleRuntimeMessage(
  message: any,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void,
): boolean {
  (async () => {
    try {
      if (!message.url) {
        sendResponse({ success: false });
        return;
      }

      log("Received message to reinitialize with URL:" + message.url);
      await initEsaPremix();
      sendResponse({ success: true });
    } catch (error) {
      console.error("Failed to reinitialize:", error);
      sendResponse({ success: false });
    }
  })();
  return true; // 非同期レスポンスを示す
}

async function main() {
  // DOMの準備完了を待つ
  await waitForDOMReady();

  // 初回の初期化
  await initEsaPremix();
}

chrome.runtime.onMessage.addListener(handleRuntimeMessage);

// 実行開始
main();
