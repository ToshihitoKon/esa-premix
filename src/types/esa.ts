// types/esa.ts
export interface CategoryItem {
  name: string;
  count: number;
  children?: "lazy" | CategoryItem[];
}

export interface PostItem {
  id: number;
  title: string;
  url: string;
  category_path: string;
}
