/* ── MangaDex normalised types ── */

export interface MangaTag {
  id: string;
  name: string;
}

export interface Manga {
  id: string;
  title: string;
  altTitles: string[];
  description: string;
  status: string;
  year: number | null;
  contentRating: string;
  tags: MangaTag[];
  authors: string[];
  artists: string[];
  coverUrl: string | null;
  coverThumb: string | null;
  lastChapter: string | null;
  lastVolume: string | null;
}

export interface Chapter {
  id: string;
  chapter: string | null;
  title: string | null;
  volume: string | null;
  language: string;
  pages: number;
  publishAt: string;
  scanlationGroup: string | null;
}

export interface ChapterPage {
  url: string;
  urlHD: string;
}

export interface ChapterPagesResponse {
  pages: ChapterPage[];
}

export interface MangaListResponse {
  data: Manga[];
  total: number;
  offset: number;
  limit: number;
}

export interface ChapterListResponse {
  data: Chapter[];
  total: number;
  offset: number;
  limit: number;
}
