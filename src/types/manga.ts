/* ── OTruyen API types ── */

export interface MangaTag {
  id: string;
  name: string;
  slug: string;
}

export interface ChapterLatest {
  filename: string;
  chapter_name: string;
  chapter_title: string;
  chapter_api_data: string;
}

export interface Manga {
  id: string;
  name: string;
  slug: string;
  origin_name: string[];
  description: string;
  status: string;
  thumb_url: string;
  authors: string[];
  categories: MangaTag[];
  updatedAt: string;
  chaptersLatest: ChapterLatest[];
}

export interface ChapterInfo {
  filename: string;
  chapter_name: string;
  chapter_title: string;
  chapter_api_data: string;
}

export interface ChapterImage {
  image_page: number;
  image_file: string;
}

export interface ChapterDetail {
  chapter_name: string;
  chapter_title: string;
  chapter_path: string;
  domain_cdn: string;
  images: ChapterImage[];
}

export interface MangaListResponse {
  items: Manga[];
  totalItems: number;
  currentPage: number;
  totalItemsPerPage: number;
}

export interface MangaDetailResponse {
  manga: Manga;
  chapters: ChapterInfo[];
}
