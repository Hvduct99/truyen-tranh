import type {
  Manga,
  MangaTag,
  ChapterInfo,
  ChapterDetail,
  MangaListResponse,
  MangaDetailResponse,
} from "@/types/manga";

const API = "https://otruyenapi.com/v1/api";
const CDN_IMAGE = "https://img.otruyenapi.com";
const CHAPTER_API_BASE = "https://sv1.otruyencdn.com/v1/api/chapter";

/** Extract chapter ID from full API URL like https://sv1.otruyencdn.com/v1/api/chapter/xxx */
export function extractChapterId(apiUrl: string): string {
  const parts = apiUrl.split("/");
  return parts[parts.length - 1] || apiUrl;
}

/** Build chapter API URL from just the ID */
export function buildChapterApiUrl(chapterId: string): string {
  return `${CHAPTER_API_BASE}/${chapterId}`;
}

/* ── helpers ── */

function normaliseManga(item: any): Manga {
  return {
    id: item._id || "",
    name: item.name || "Unknown",
    slug: item.slug || "",
    origin_name: Array.isArray(item.origin_name) ? item.origin_name : [],
    description: item.content || "",
    status: item.status || "ongoing",
    thumb_url: item.thumb_url
      ? `${CDN_IMAGE}/uploads/comics/${item.thumb_url}`
      : "",
    authors: Array.isArray(item.author) ? item.author : [],
    categories: (item.category || []).map((c: any) => ({
      id: c.id || "",
      name: c.name || "",
      slug: c.slug || "",
    })),
    updatedAt: item.updatedAt || "",
    chaptersLatest: (item.chaptersLatest || []).map((ch: any) => ({
      filename: ch.filename || "",
      chapter_name: ch.chapter_name || "",
      chapter_title: ch.chapter_title || "",
      chapter_api_data: ch.chapter_api_data || "",
    })),
  };
}

async function apiFetch(url: string) {
  const res = await fetch(url, { next: { revalidate: 300 } } as any);
  if (!res.ok) {
    throw new Error(`OTruyen API ${res.status}: ${url}`);
  }
  return res.json();
}

/* ── Public API ── */

export async function getHomeManga(): Promise<MangaListResponse> {
  const json = await apiFetch(`${API}/home`);
  const data = json.data || {};
  return {
    items: (data.items || []).map(normaliseManga),
    totalItems: data.params?.pagination?.totalItems || 0,
    currentPage: data.params?.pagination?.currentPage || 1,
    totalItemsPerPage: data.params?.pagination?.totalItemsPerPage || 24,
  };
}

export async function getLatestManga(page = 1): Promise<MangaListResponse> {
  const json = await apiFetch(`${API}/danh-sach/truyen-moi?page=${page}`);
  const data = json.data || {};
  return {
    items: (data.items || []).map(normaliseManga),
    totalItems: data.params?.pagination?.totalItems || 0,
    currentPage: data.params?.pagination?.currentPage || page,
    totalItemsPerPage: data.params?.pagination?.totalItemsPerPage || 24,
  };
}

export async function getPopularManga(page = 1): Promise<MangaListResponse> {
  const json = await apiFetch(`${API}/danh-sach/sap-ra-mat?page=${page}`);
  const data = json.data || {};
  return {
    items: (data.items || []).map(normaliseManga),
    totalItems: data.params?.pagination?.totalItems || 0,
    currentPage: data.params?.pagination?.currentPage || page,
    totalItemsPerPage: data.params?.pagination?.totalItemsPerPage || 24,
  };
}

export async function getCompletedManga(page = 1): Promise<MangaListResponse> {
  const json = await apiFetch(`${API}/danh-sach/hoan-thanh?page=${page}`);
  const data = json.data || {};
  return {
    items: (data.items || []).map(normaliseManga),
    totalItems: data.params?.pagination?.totalItems || 0,
    currentPage: data.params?.pagination?.currentPage || page,
    totalItemsPerPage: data.params?.pagination?.totalItemsPerPage || 24,
  };
}

export async function searchManga(
  keyword: string,
  page = 1
): Promise<MangaListResponse> {
  const json = await apiFetch(
    `${API}/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`
  );
  const data = json.data || {};
  return {
    items: (data.items || []).map(normaliseManga),
    totalItems: data.params?.pagination?.totalItems || 0,
    currentPage: data.params?.pagination?.currentPage || page,
    totalItemsPerPage: data.params?.pagination?.totalItemsPerPage || 24,
  };
}

export async function getMangaBySlug(slug: string): Promise<MangaDetailResponse> {
  const json = await apiFetch(`${API}/truyen-tranh/${slug}`);
  const data = json.data || {};
  const item = data.item || {};

  const manga = normaliseManga(item);

  // Extract chapters from first server
  const serverData = item.chapters?.[0]?.server_data || [];
  const chapters: ChapterInfo[] = serverData.map((ch: any) => ({
    filename: ch.filename || "",
    chapter_name: ch.chapter_name || "",
    chapter_title: ch.chapter_title || "",
    chapter_api_data: ch.chapter_api_data || "",
  }));

  return { manga, chapters };
}

export async function getChapterDetail(apiUrl: string): Promise<ChapterDetail> {
  const json = await apiFetch(apiUrl);
  const data = json.data || {};
  const item = data.item || {};

  return {
    chapter_name: item.chapter_name || "",
    chapter_title: item.chapter_title || "",
    chapter_path: item.chapter_path || "",
    domain_cdn: data.domain_cdn || "https://sv1.otruyencdn.com",
    images: (item.chapter_image || []).map((img: any) => ({
      image_page: img.image_page || 0,
      image_file: img.image_file || "",
    })),
  };
}

export async function getMangaTags(): Promise<MangaTag[]> {
  const json = await apiFetch(`${API}/the-loai`);
  const data = json.data || {};
  return (data.items || []).map((t: any) => ({
    id: t._id || "",
    name: t.name || "",
    slug: t.slug || "",
  }));
}

const SPINOFF_KEYWORDS = [
  "ngoại truyện",
  "ngoai truyen",
  "spin-off",
  "spin off",
  "spinoff",
  "color",
  "special",
  "đặc biệt",
  "dac biet",
  "side story",
  "side-story",
  "extra",
  "ngoài lề",
  "phụ bản",
  "phu ban",
  "tiền truyện",
  "tien truyen",
  "ova",
  "remake",
  "fanbook",
];

function getHighestChapterNumber(manga: Manga): number {
  if (!manga.chaptersLatest || manga.chaptersLatest.length === 0) return 0;
  const nums = manga.chaptersLatest
    .map((ch) => parseFloat(ch.chapter_name))
    .filter((n) => !isNaN(n));
  return nums.length > 0 ? Math.max(...nums) : 0;
}

/** Search multiple hot titles, prefer the main series (most chapters, no spin-off keywords) */
export async function getHotManga(titles: string[]): Promise<Manga[]> {
  const results = await Promise.allSettled(
    titles.map(async (title) => {
      const res = await searchManga(title, 1);
      if (res.items.length === 0) return null;

      const titleLower = title.toLowerCase();

      // Keep only items whose name actually contains the search title
      const matching = res.items.filter((m) =>
        m.name.toLowerCase().includes(titleLower)
      );
      const pool = matching.length > 0 ? matching : res.items;

      // Drop obvious spin-offs / side stories
      const mainOnly = pool.filter((m) => {
        const n = m.name.toLowerCase();
        return !SPINOFF_KEYWORDS.some((kw) => n.includes(kw));
      });
      const candidates = mainOnly.length > 0 ? mainOnly : pool;

      // Pick the one with the highest chapter number (main series has the most chapters)
      candidates.sort(
        (a, b) => getHighestChapterNumber(b) - getHighestChapterNumber(a)
      );
      return candidates[0] || null;
    })
  );
  return results
    .filter(
      (r): r is PromiseFulfilledResult<Manga> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value);
}

export async function getMangaByGenre(
  genreSlug: string,
  page = 1
): Promise<MangaListResponse> {
  const json = await apiFetch(`${API}/the-loai/${genreSlug}?page=${page}`);
  const data = json.data || {};
  return {
    items: (data.items || []).map(normaliseManga),
    totalItems: data.params?.pagination?.totalItems || 0,
    currentPage: data.params?.pagination?.currentPage || page,
    totalItemsPerPage: data.params?.pagination?.totalItemsPerPage || 24,
  };
}
