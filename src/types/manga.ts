/* ── App-level types (normalised from MangaDex) ── */

export type MangaStatus = "ongoing" | "completed" | "hiatus" | "cancelled";

export interface MangaTag {
  id: string;
  name: string; // Vietnamese label when we have one
  group: string; // genre | theme | format | content
}

export interface ChapterInfo {
  id: string;
  chapter: string | null; // "12", "12.5" or null for oneshots
  title: string;
  lang: string; // vi | en
  publishAt: string;
  group: string;
}

export interface Manga {
  id: string;
  title: string;
  altTitle: string;
  description: string;
  status: MangaStatus;
  year: number | null;
  cover: string; // proxied URL, "" when missing
  authors: string[];
  tags: MangaTag[];
  updatedAt: string;
  lastChapter: string | null;
  latestChapters: ChapterInfo[]; // filled only by the "latest updates" feed
}

export interface ChapterPages {
  id: string;
  chapter: string | null;
  title: string;
  pages: string[]; // data-saver, proxied
  pagesHd: string[]; // full quality, proxied
}

export interface MangaListResponse {
  items: Manga[];
  total: number;
  page: number;
  perPage: number;
}
