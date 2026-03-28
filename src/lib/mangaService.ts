import type {
  Manga,
  Chapter,
  ChapterPage,
  MangaListResponse,
  ChapterListResponse,
  ChapterPagesResponse,
} from "@/types/manga";

const API = "https://api.mangadex.org";

/* ── helpers ── */

function title(attrs: any): string {
  if (!attrs.title) return "Unknown";
  return (
    attrs.title.vi ||
    attrs.title.en ||
    attrs.title["ja-ro"] ||
    attrs.title.ja ||
    Object.values(attrs.title)[0] ||
    "Unknown"
  ) as string;
}

function altTitles(attrs: any): string[] {
  if (!Array.isArray(attrs.altTitles)) return [];
  const out: string[] = [];
  for (const obj of attrs.altTitles) {
    for (const v of Object.values(obj)) if (v) out.push(v as string);
  }
  return out.slice(0, 5);
}

function description(attrs: any): string {
  if (!attrs.description) return "";
  return (
    (attrs.description.vi || attrs.description.en || Object.values(attrs.description)[0] || "") as string
  );
}

function coverFile(item: any): string | null {
  const rel = (item.relationships || []).find((r: any) => r.type === "cover_art");
  return rel?.attributes?.fileName || null;
}

function coverUrl(mangaId: string, fileName: string | null, size?: string): string | null {
  if (!fileName) return null;
  const base = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
  return size ? `${base}.${size}.jpg` : base;
}

function authorName(item: any, type: string): string[] {
  return (item.relationships || [])
    .filter((r: any) => r.type === type && r.attributes?.name)
    .map((r: any) => r.attributes.name as string);
}

function normaliseManga(item: any): Manga {
  const a = item.attributes;
  const file = coverFile(item);
  return {
    id: item.id,
    title: title(a),
    altTitles: altTitles(a),
    description: description(a),
    status: a.status || "unknown",
    year: a.year || null,
    contentRating: a.contentRating || "safe",
    tags: (a.tags || []).map((t: any) => ({
      id: t.id,
      name: t.attributes?.name?.en || t.attributes?.name?.vi || "Unknown",
    })),
    authors: authorName(item, "author"),
    artists: authorName(item, "artist"),
    coverUrl: coverUrl(item.id, file),
    coverThumb: coverUrl(item.id, file, "256"),
    lastChapter: a.lastChapter || null,
    lastVolume: a.lastVolume || null,
  };
}

function normaliseChapter(item: any): Chapter {
  const a = item.attributes;
  const group = (item.relationships || []).find((r: any) => r.type === "scanlation_group");
  return {
    id: item.id,
    chapter: a.chapter || null,
    title: a.title || null,
    volume: a.volume || null,
    language: a.translatedLanguage || "en",
    pages: a.pages || 0,
    publishAt: a.publishAt || a.createdAt || "",
    scanlationGroup: group?.attributes?.name || null,
  };
}

async function mdFetch(path: string, params?: Record<string, string | string[]>) {
  const url = new URL(`${API}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (Array.isArray(v)) {
        for (const item of v) url.searchParams.append(k, item);
      } else {
        url.searchParams.set(k, v);
      }
    }
  }
  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`MangaDex ${res.status}: ${url.pathname}`);
  }
  return res.json();
}

/* ── public API ── */

const INCLUDES = ["cover_art", "author", "artist"];

export async function getPopularManga(limit = 24, offset = 0): Promise<MangaListResponse> {
  const data = await mdFetch("/manga", {
    "includes[]": INCLUDES,
    "order[followedCount]": "desc",
    "contentRating[]": ["safe", "suggestive"],
    limit: String(Math.min(limit, 32)),
    offset: String(offset),
    "availableTranslatedLanguage[]": ["vi", "en"],
  });
  return {
    data: data.data.map(normaliseManga),
    total: data.total,
    offset: data.offset,
    limit: data.limit,
  };
}

export async function getLatestManga(limit = 24, offset = 0): Promise<MangaListResponse> {
  const data = await mdFetch("/manga", {
    "includes[]": INCLUDES,
    "order[latestUploadedChapter]": "desc",
    "contentRating[]": ["safe", "suggestive"],
    limit: String(Math.min(limit, 32)),
    offset: String(offset),
    "availableTranslatedLanguage[]": ["vi", "en"],
  });
  return {
    data: data.data.map(normaliseManga),
    total: data.total,
    offset: data.offset,
    limit: data.limit,
  };
}

export async function searchManga(query: string, limit = 20, offset = 0): Promise<MangaListResponse> {
  const data = await mdFetch("/manga", {
    title: query,
    "includes[]": INCLUDES,
    "contentRating[]": ["safe", "suggestive"],
    "order[relevance]": "desc",
    limit: String(Math.min(limit, 32)),
    offset: String(offset),
  });
  return {
    data: data.data.map(normaliseManga),
    total: data.total,
    offset: data.offset,
    limit: data.limit,
  };
}

export async function getMangaById(id: string): Promise<Manga> {
  const data = await mdFetch(`/manga/${id}`, {
    "includes[]": INCLUDES,
  });
  return normaliseManga(data.data);
}

export async function getChapters(
  mangaId: string,
  limit = 96,
  offset = 0,
  lang?: string
): Promise<ChapterListResponse> {
  const languages = lang ? [lang] : ["vi", "en"];
  const data = await mdFetch(`/manga/${mangaId}/feed`, {
    "translatedLanguage[]": languages,
    "includes[]": ["scanlation_group"],
    "order[chapter]": "asc",
    limit: String(Math.min(limit, 96)),
    offset: String(offset),
    "contentRating[]": ["safe", "suggestive"],
  });
  return {
    data: (data.data || []).map(normaliseChapter),
    total: data.total,
    offset: data.offset,
    limit: data.limit,
  };
}

export async function getChapterPages(chapterId: string): Promise<ChapterPagesResponse> {
  const data = await mdFetch(`/at-home/server/${chapterId}`);
  const base = data.baseUrl;
  const hash = data.chapter.hash;
  const pages: ChapterPage[] = (data.chapter.data || []).map((file: string, i: number) => ({
    url: `${base}/data-saver/${hash}/${data.chapter.dataSaver?.[i] || file}`,
    urlHD: `${base}/data/${hash}/${file}`,
  }));
  return { pages };
}

export async function getFeaturedManga(): Promise<MangaListResponse> {
  return getPopularManga(8, 0);
}

/* ── Tags / Genres ── */

export interface MangaTagFull {
  id: string;
  name: string;
  group: string;
}

export async function getMangaTags(): Promise<MangaTagFull[]> {
  const data = await mdFetch("/manga/tag");
  return (data.data || []).map((t: any) => ({
    id: t.id,
    name: t.attributes?.name?.en || t.attributes?.name?.vi || "Unknown",
    group: t.attributes?.group || "genre",
  }));
}

export async function getMangaByTag(
  tagId: string,
  limit = 24,
  offset = 0
): Promise<MangaListResponse> {
  const data = await mdFetch("/manga", {
    "includes[]": INCLUDES,
    "includedTags[]": [tagId],
    "order[followedCount]": "desc",
    "contentRating[]": ["safe", "suggestive"],
    limit: String(Math.min(limit, 32)),
    offset: String(offset),
    "availableTranslatedLanguage[]": ["vi", "en"],
  });
  return {
    data: data.data.map(normaliseManga),
    total: data.total,
    offset: data.offset,
    limit: data.limit,
  };
}
