import { log } from "../utils/log.ts";

const preview_window_class = "esa-premix-preview-window";
const preview_window_close_button_class = "esa-premix-preview-close";
const preview_window_iframe_class = "esa-premix-preview-iframe";
const preview_window_active_class = "esa-premix-preview-active";
const preview_button_class = "esa-premix-preview-button";

function isSkipPreviewButton(anchor: HTMLAnchorElement): boolean {
  const href = anchor.href as string;
  // 以下のいずれかのパターンはボタンを追加しない
  if (
    // esa.io ドメイン以外へのリンク
    !(href.startsWith("/") || href.includes("esa.io")) ||
    // 一覧ページ
    href.includes("path=") ||
    // 記事ページではない
    href.includes("/edit") ||
    href.includes("#comment") ||
    href.includes("/revisions/") ||
    // 記事ページの Header 要素に自動でつくリンク
    anchor.classList.contains("anchor") ||
    // メンバーアイコン
    anchor.querySelector("img")?.classList.contains("member_emoji") ||
    // 添付ファイル
    href.includes("/uploads/")
  ) {
    return true;
  }
  return false;
}

function isAlreadyAddedPreviewButton(anchor: HTMLAnchorElement): boolean {
  if (anchor.parentElement?.querySelector(`.${preview_button_class}`)) {
    return true;
  }
  return false;
}

function addPreviewButtonToAnchor(anchor: HTMLAnchorElement) {
  // プレビューボタンを作成
  const previewButton = document.createElement("button");
  previewButton.className = preview_button_class;
  previewButton.textContent = "🎈";
  previewButton.title = "プレビューを表示";

  // プレビューボタンのクリックイベント
  const href = anchor.href as string;
  previewButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showPreviewWindow(href);
  });

  // リンクの後にプレビューボタンを挿入
  anchor.parentElement?.insertBefore(previewButton, anchor.nextSibling);
}

function createPreviewWindowHTML() {
  return `
    <div class="${preview_window_class}">
      <div class="esa-premix-preview-content">
        <iframe class="${preview_window_iframe_class}" src="" sandbox="allow-scripts allow-same-origin"></iframe>
      </div>
    </div>
  `;
}

function showPreviewWindow(postUrl: string) {
  if (!postUrl) {
    log("No post URL provided, cannot show preview window");
    return;
  }

  let previewWindow = document.querySelector(
    `.${preview_window_class}`,
  ) as HTMLElement;

  // preview window が存在しない場合は作成
  if (!previewWindow) {
    document.body.insertAdjacentHTML("beforeend", createPreviewWindowHTML());
    previewWindow = document.querySelector(
      `.${preview_window_class}`,
    ) as HTMLElement;

    const closeButton = previewWindow.querySelector(
      `.${preview_window_close_button_class}`,
    );
    closeButton?.addEventListener("click", hidePreviewWindow);

    // 背景をクリックしたら閉じる
    previewWindow.addEventListener("click", (e) => {
      if (e.target === previewWindow) {
        hidePreviewWindow();
      }
    });
  }

  const iframe = previewWindow.querySelector(
    `.${preview_window_iframe_class}`,
  ) as HTMLIFrameElement;
  iframe.src = postUrl;

  previewWindow.classList.add(preview_window_active_class);
}

/**
 * プレビューペインを非表示
 */
function hidePreviewWindow() {
  const previewWindow = document.querySelector(
    `.${preview_window_class}`,
  ) as HTMLElement;
  if (previewWindow) {
    previewWindow.classList.remove(preview_window_active_class);

    // iframeの内容をクリア
    const iframe = previewWindow.querySelector(
      `.${preview_window_iframe_class}`,
    ) as HTMLIFrameElement;
    iframe.src = "";
  }
}

/**
 * ESCキーでプレビューペインを閉じる
 */
function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === "Escape") {
    const previewWindow = document.querySelector(
      `.${preview_window_class}`,
    ) as HTMLElement;
    if (
      previewWindow &&
      previewWindow.classList.contains(preview_window_active_class)
    ) {
      hidePreviewWindow();
    }
  }
}

/**
 * 記事ページへのリンクにプレビューボタンを追加
 */
function addPreviewButtons() {
  const links = [];
  // post-title__link class がついている
  links.push(...document.querySelectorAll("a.post-title__link"));
  // post-body の子要素
  links.push(...document.querySelectorAll(".post-body a"));

  links.forEach((link) => {
    if (
      isSkipPreviewButton(link as HTMLAnchorElement) ||
      isAlreadyAddedPreviewButton(link as HTMLAnchorElement)
    ) {
      return;
    }

    addPreviewButtonToAnchor(link as HTMLAnchorElement);
  });
}

/**
 * DOM変更を監視して新しく追加されたリンクにプレビューボタンを追加
 */
function setupMutationObserver() {
  const targetNode = document.querySelector("ul.post-list");
  if (!targetNode) {
    log("post-list not found, skipping MutationObserver setup");
    return;
  }

  const config = {
    childList: true,
    subtree: true,
  };

  const callback = (mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const newLinks = element.querySelectorAll("a.post-title__link");

            newLinks.forEach((link) => {
              if (
                isSkipPreviewButton(link as HTMLAnchorElement) ||
                isAlreadyAddedPreviewButton(link as HTMLAnchorElement)
              ) {
                return;
              }
              addPreviewButtonToAnchor(link as HTMLAnchorElement);
            });
          }
        });
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);

  log("MutationObserver set up for post-list");
}

/**
 * プレビューを初期化
 */
export function initPreviewWindow() {
  // 既に初期化済みの場合は処理しない
  if (document.querySelector(`.${preview_window_class}`)) {
    log("Preview window already initialized, skipping");
    return;
  }

  // ESCキーのイベントリスナーを一度だけ設定
  document.addEventListener("keydown", handleEscapeKey);

  addPreviewButtons();
  setupMutationObserver();
  log("Preview window initialized successfully");
}
