import { fetchCategoryHierarchy, getCurrentCategoryPath } from "./apiClient.ts";
import { log } from "../utils/log.ts";

/**
 * ファイラー型カテゴリビューのHTMLを生成
 */
function createCategoryFilerHTML(categories: any): string {
  const categoryItems = categories
    .map((cat: any) => {
      // カテゴリ名を適切にエスケープし、数字のみのカテゴリにも対応
      const categoryName = String(cat.name).trim();
      const displayName = categoryName || "(名前なし)";

      return `
    <div class="esa-premix-category-item" data-path="${categoryName}">
      <span class="esa-premix-category-icon fa fa-folder"></span>
      <span class="esa-premix-category-name">${displayName}</span>
      <span class="esa-premix-category-post-count">${cat.count || 0}</span>
    </div>
  `;
    })
    .join("");
  return `
    <div class="esa-premix-category-window">
      <h3>サブカテゴリ</h3>
      <div class="esa-premix-category-tree">
        ${categoryItems}
      </div>
    </div>
  `;
}

/**
 * カテゴリアイテムにクリックイベントを追加
 */
function addCategoryClickHandlers(currentPath: string): void {
  const categoryItems = document.querySelectorAll(".esa-premix-category-item");

  categoryItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const categoryName = (item as HTMLElement).getAttribute("data-path");
      if (categoryName) {
        // パス構築を安全に行う
        const trimmedCategoryName = categoryName.trim();
        const normalizedCurrentPath = currentPath === "/" ? "" : currentPath;
        const newPath = `${normalizedCurrentPath}/${trimmedCategoryName}`;

        log(`Navigating from ${currentPath} to ${newPath}`);
        window.location.hash = `path=${encodeURIComponent(newPath)}`;
      }
    });
  });

  // moreボタンのイベントハンドラを追加
  const moreButton = document.querySelector(".esa-more-button");
  if (moreButton) {
    moreButton.addEventListener("click", (e) => {
      e.preventDefault();
      const isExpanded = moreButton.getAttribute("data-expanded") === "true";
      const hiddenItems = document.querySelectorAll(".esa-category-hidden");
      const moreText = moreButton.querySelector(".more-text");

      if (isExpanded) {
        // 折りたたみ
        hiddenItems.forEach((item) =>
          item.classList.add("esa-category-hidden"),
        );
        moreButton.setAttribute("data-expanded", "false");
        if (moreText) {
          const hiddenCount = hiddenItems.length;
          moreText.textContent = `さらに表示 (+${hiddenCount})`;
        }
      } else {
        // 展開
        hiddenItems.forEach((item) =>
          item.classList.remove("esa-category-hidden"),
        );
        moreButton.setAttribute("data-expanded", "true");
        if (moreText) {
          moreText.textContent = "";
        }
      }
    });
  }
}

/**
 * カテゴリページかどうかを判定
 */
function isCategoryPage(url: string): boolean {
  return url.includes("path=");
}

/**
 * 挿入位置の要素を取得
 */
function getInsertionPoint(): Element | null {
  const mainContent = document.getElementById("js_autopagerize_column");
  if (!mainContent) return null;

  const article = mainContent.getElementsByClassName("post-list");
  if (article.length === 0) return null;
  return article[0];
}

/**
 * ファイラー型カテゴリ表示を実装
 */
export async function initCategoryFiler(url: string): Promise<void> {
  // カテゴリページでない場合は処理しない
  if (!isCategoryPage(url)) {
    return;
  }

  // 既に表示されている場合は一度削除する
  document.querySelector(".esa-premix-category-window")?.remove();

  const insertionPoint = getInsertionPoint();
  if (!insertionPoint) {
    console.warn("Category filer insertion point not found");
    return;
  }

  try {
    const currentPath = getCurrentCategoryPath(url);
    const categoryItems = await fetchCategoryHierarchy(currentPath);
    log(`Fetched category data: ${categoryItems}`);

    // 子カテゴリがない場合は表示しない
    if (!categoryItems || categoryItems.length === 0) {
      return;
    }

    const filerHTML = createCategoryFilerHTML(categoryItems);
    insertionPoint.insertAdjacentHTML("beforebegin", filerHTML);

    // クリックハンドラーを追加
    addCategoryClickHandlers(currentPath);

    log("Category filer initialized successfully");
  } catch (error) {
    console.error("Failed to initialize category filer:", error);
  }
}
