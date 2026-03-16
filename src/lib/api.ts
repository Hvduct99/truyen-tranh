import {
  Manga,
  MangaListResponse,
  RecommendationResponse,
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
  page = 1
): Promise<MangaListResponse> {
  return fetchApi<MangaListResponse>(
    `/api/manga/search?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}`
  );
}

export async function getMangaById(id: string): Promise<Manga> {
  return fetchApi<Manga>(`/api/manga/${encodeURIComponent(id)}`);
}

export async function getPopularManga(
  limit = 24,
  page = 1
): Promise<MangaListResponse> {
  return fetchApi<MangaListResponse>(
    `/api/manga/list/popular?limit=${limit}&page=${page}`
  );
}

export async function getLatestManga(
  limit = 24,
  page = 1
): Promise<MangaListResponse> {
  return fetchApi<MangaListResponse>(
    `/api/manga/list/latest?limit=${limit}&page=${page}`
  );
}

export async function getRecommendations(
  id: string
): Promise<RecommendationResponse> {
  return fetchApi<RecommendationResponse>(
    `/api/manga/${encodeURIComponent(id)}/recommendations`
  );
}
