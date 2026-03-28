import type {
  Manga,
  MangaListResponse,
  ChapterListResponse,
  ChapterPagesResponse,
} from "@/types/manga";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getFeaturedManga(): Promise<MangaListResponse> {
  return fetchApi<MangaListResponse>("/api/manga/featured");
}

export async function searchManga(
  query: string,
  limit = 20,
  offset = 0
): Promise<MangaListResponse> {
  return fetchApi<MangaListResponse>(
    `/api/manga/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
  );
}

export async function getMangaById(id: string): Promise<Manga> {
  return fetchApi<Manga>(`/api/manga/${encodeURIComponent(id)}`);
}

export async function getPopularManga(
  limit = 24,
  offset = 0
): Promise<MangaListResponse> {
  return fetchApi<MangaListResponse>(
    `/api/manga/list/popular?limit=${limit}&offset=${offset}`
  );
}

export async function getLatestManga(
  limit = 24,
  offset = 0
): Promise<MangaListResponse> {
  return fetchApi<MangaListResponse>(
    `/api/manga/list/latest?limit=${limit}&offset=${offset}`
  );
}

export async function getChapters(
  mangaId: string,
  limit = 96,
  offset = 0
): Promise<ChapterListResponse> {
  return fetchApi<ChapterListResponse>(
    `/api/manga/${encodeURIComponent(mangaId)}/chapters?limit=${limit}&offset=${offset}`
  );
}

export async function getChapterPages(
  chapterId: string
): Promise<ChapterPagesResponse> {
  return fetchApi<ChapterPagesResponse>(
    `/api/manga/chapter/${encodeURIComponent(chapterId)}/pages`
  );
}

export interface MangaTagFull {
  id: string;
  name: string;
  group: string;
}

export async function getMangaTags(): Promise<MangaTagFull[]> {
  return fetchApi<MangaTagFull[]>("/api/manga/tags");
}

export async function getMangaByTag(
  tagId: string,
  limit = 24,
  offset = 0
): Promise<MangaListResponse> {
  return fetchApi<MangaListResponse>(
    `/api/manga/by-tag?tagId=${encodeURIComponent(tagId)}&limit=${limit}&offset=${offset}`
  );
}
