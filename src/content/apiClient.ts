import { CategoryResponse, CategoryItem } from "../types/esa.ts";
import { log } from "../utils/log.ts";

/**
 * esa.ioのカテゴリAPIからデータを取得
 */
export async function fetchCategoryHierarchy(
  path: string,
): Promise<CategoryResponse> {
  try {
    const targetPath = path || "/";
    const encodedPath = encodeURIComponent(targetPath);

    const response = await fetch(
      `/api/categories.json?path=${encodedPath}&on=0`,
      {
        credentials: "same-origin",
      },
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    log(`API returned data for path ${targetPath}:`, data);

    return data.children || [];
  } catch (error) {
    console.error(`Failed to fetch categories for path ${path}:`, error);
    throw error;
  }
}

/**
 * 現在のカテゴリパスを取得
 */
export function getCurrentCategoryPath(url: string) {
  const pathMatch = url.match(/path=([^&]+)/);

  if (pathMatch) {
    return decodeURIComponent(pathMatch[1]);
  }

  return "/";
}
