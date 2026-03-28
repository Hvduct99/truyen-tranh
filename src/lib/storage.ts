/* localStorage utilities for history & bookmarks */

export interface HistoryEntry {
  mangaId: string;
  mangaTitle: string;
  coverThumb: string | null;
  chapterId: string;
  chapterNum: string;
  timestamp: number;
}

export interface BookmarkEntry {
  mangaId: string;
  mangaTitle: string;
  coverThumb: string | null;
  authors: string[];
  timestamp: number;
}

const HISTORY_KEY = "mangaverse_history";
const BOOKMARK_KEY = "mangaverse_bookmarks";
const MAX_HISTORY = 100;

function getStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStorage<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

/* ── History ── */

export function getHistory(): HistoryEntry[] {
  return getStorage<HistoryEntry>(HISTORY_KEY);
}

export function addHistory(entry: Omit<HistoryEntry, "timestamp">) {
  const list = getHistory().filter((h) => h.chapterId !== entry.chapterId);
  list.unshift({ ...entry, timestamp: Date.now() });
  setStorage(HISTORY_KEY, list.slice(0, MAX_HISTORY));
}

export function clearHistory() {
  setStorage(HISTORY_KEY, []);
}

/* ── Bookmarks ── */

export function getBookmarks(): BookmarkEntry[] {
  return getStorage<BookmarkEntry>(BOOKMARK_KEY);
}

export function addBookmark(entry: Omit<BookmarkEntry, "timestamp">) {
  const list = getBookmarks().filter((b) => b.mangaId !== entry.mangaId);
  list.unshift({ ...entry, timestamp: Date.now() });
  setStorage(BOOKMARK_KEY, list);
}

export function removeBookmark(mangaId: string) {
  const list = getBookmarks().filter((b) => b.mangaId !== mangaId);
  setStorage(BOOKMARK_KEY, list);
}

export function isBookmarked(mangaId: string): boolean {
  return getBookmarks().some((b) => b.mangaId === mangaId);
}
