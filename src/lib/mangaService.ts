import type {
  Manga,
  MangaStatus,
  MangaTag,
  ChapterInfo,
  ChapterPages,
  MangaListResponse,
} from "@/types/manga";

/*
 * MangaDex data layer.
 *
 * MangaDex is blocked by Vietnamese ISPs (DNS + SNI), so the browser never
 * talks to it directly: server components call the API here, and every image
 * goes through our own /api/img proxy.
 *
 * MANGADEX_API_BASE can point somewhere else (e.g. a local mock) for dev.
 */
const API = process.env.MANGADEX_API_BASE || "https://api.mangadex.org";
const IMG_PROXY = "/api/img";

const CONTENT_RATING = ["safe", "suggestive"];
const LIST_LANGS = ["vi"];
const READ_LANGS = ["vi", "en"]; // chapter languages, in order of preference
const PER_PAGE = 24;
const MAX_OFFSET = 10000; // MangaDex refuses offset + limit above this

/* ── fetch helpers ── */

type Params = Record<string, string | number | (string | number)[] | undefined>;

function qs(params: Params): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) value.forEach((v) => sp.append(key, String(v)));
    else sp.append(key, String(value));
  }
  return sp.toString();
}

async function md(path: string, params: Params = {}, revalidate = 300) {
  const url = `${API}${path}${Object.keys(params).length ? `?${qs(params)}` : ""}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "MangaVerse/1.0 (+https://truyentranh.store)" },
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`MangaDex ${res.status}: ${path}`);
  }
  return res.json();
}

/* ── normalisers ── */

const TAG_VI: Record<string, string> = {
  Action: "Hành động",
  Adventure: "Phiêu lưu",
  Comedy: "Hài hước",
  Drama: "Drama",
  Fantasy: "Giả tưởng",
  Horror: "Kinh dị",
  Mystery: "Bí ẩn",
  Romance: "Tình cảm",
  "Sci-Fi": "Khoa học viễn tưởng",
  "Slice of Life": "Đời thường",
  Sports: "Thể thao",
  Thriller: "Giật gân",
  Tragedy: "Bi kịch",
  Psychological: "Tâm lý",
  Isekai: "Isekai",
  "Martial Arts": "Võ thuật",
  "School Life": "Học đường",
  Supernatural: "Siêu nhiên",
  Historical: "Lịch sử",
  Magic: "Phép thuật",
  Mecha: "Mecha",
  Medical: "Y học",
  Military: "Quân đội",
  Music: "Âm nhạc",
  Crime: "Tội phạm",
  Cooking: "Ẩm thực",
  Demons: "Ác quỷ",
  Ghosts: "Ma",
  Harem: "Harem",
  "Reverse Harem": "Harem ngược",
  "Magical Girls": "Ma pháp thiếu nữ",
  Monsters: "Quái vật",
  "Monster Girls": "Nữ quái vật",
  Ninja: "Ninja",
  Philosophical: "Triết học",
  Police: "Cảnh sát",
  "Post-Apocalyptic": "Hậu tận thế",
  Reincarnation: "Chuyển sinh",
  Samurai: "Samurai",
  Survival: "Sinh tồn",
  "Time Travel": "Xuyên không",
  Vampires: "Ma cà rồng",
  "Video Games": "Trò chơi",
  "Traditional Games": "Trò chơi dân gian",
  Villainess: "Phản diện",
  "Virtual Reality": "Thực tế ảo",
  Zombies: "Zombie",
  "Office Workers": "Công sở",
  Delinquents: "Du côn",
  Superhero: "Siêu anh hùng",
  "Boys' Love": "Đam mỹ",
  "Girls' Love": "Bách hợp",
  Wuxia: "Võ hiệp",
  Aliens: "Người ngoài hành tinh",
  Animals: "Động vật",
  Mafia: "Mafia",
  Genderswap: "Hoán đổi giới tính",
  Crossdressing: "Giả trang",
  Gyaru: "Gyaru",
  "Long Strip": "Truyện dài (cuộn dọc)",
  "Full Color": "Full màu",
  "Web Comic": "Webtoon",
  "4-Koma": "4-Koma",
  Oneshot: "Oneshot",
  Adaptation: "Chuyển thể",
  Anthology: "Tuyển tập",
  "Award Winning": "Đoạt giải",
  Doujinshi: "Doujinshi",
  "Official Colored": "Bản màu chính thức",
  "Fan Colored": "Fan tô màu",
  "User Created": "Người dùng sáng tác",
  "Self-Published": "Tự xuất bản",
  Gore: "Bạo lực",
};

function pickLocalized(obj: Record<string, string> | undefined, order = ["vi", "en"]): string {
  if (!obj) return "";
  for (const lang of order) if (obj[lang]) return obj[lang];
  return Object.values(obj)[0] || "";
}

function normaliseTag(t: any): MangaTag {
  const en = t.attributes?.name?.en || "";
  return { id: t.id, name: TAG_VI[en] || en, group: t.attributes?.group || "" };
}

function cleanDescription(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // markdown links → text
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1") // bold / italic
    .replace(/^-{3,}$[\s\S]*/m, "") // drop trailing "---" link blocks
    .trim();
}

export function coverUrl(mangaId: string, fileName: string, size: 256 | 512 = 512) {
  return `${IMG_PROXY}/covers/${mangaId}/${fileName}.${size}.jpg`;
}

function normaliseManga(item: any): Manga {
  const a = item.attributes || {};
  const rels: any[] = item.relationships || [];

  // altTitles is an array of single-key objects: [{ vi: "..." }, { ja: "..." }]
  const alt: Record<string, string> = {};
  for (const t of a.altTitles || []) {
    for (const [lang, val] of Object.entries(t)) if (!alt[lang]) alt[lang] = val as string;
  }
  const original = pickLocalized(a.title, ["en", "ja-ro", "ko-ro", "zh-ro"]);
  const title = alt.vi || original || "Không rõ tên";

  const cover = rels.find((r) => r.type === "cover_art");
  const authors = rels
    .filter((r) => (r.type === "author" || r.type === "artist") && r.attributes?.name)
    .map((r) => r.attributes.name as string);

  return {
    id: item.id,
    title,
    altTitle: title === original ? alt.en || "" : original,
    description: cleanDescription(pickLocalized(a.description)),
    status: (a.status || "ongoing") as MangaStatus,
    year: a.year ?? null,
    cover: cover?.attributes?.fileName ? coverUrl(item.id, cover.attributes.fileName) : "",
    authors: Array.from(new Set(authors)),
    tags: (a.tags || []).map(normaliseTag),
    updatedAt: a.updatedAt || "",
    lastChapter: a.lastChapter || null,
    latestChapters: [],
  };
}

function normaliseChapter(c: any): ChapterInfo {
  const a = c.attributes || {};
  const group = (c.relationships || []).find((r: any) => r.type === "scanlation_group");
  return {
    id: c.id,
    chapter: a.chapter ?? null,
    title: a.title || "",
    lang: a.translatedLanguage || "",
    publishAt: a.readableAt || a.publishAt || "",
    group: group?.attributes?.name || "",
  };
}

function toList(json: any, page: number, perPage: number): MangaListResponse {
  return {
    items: (json.data || []).map(normaliseManga),
    total: Math.min(json.total || 0, MAX_OFFSET),
    page,
    perPage,
  };
}

function offsetFor(page: number, perPage: number) {
  return Math.min((page - 1) * perPage, MAX_OFFSET - perPage);
}

const MANGA_INCLUDES = ["cover_art", "author", "artist"];

/* ── Public API ── */

interface ListOptions {
  page?: number;
  perPage?: number;
  order?: "followedCount" | "latestUploadedChapter" | "createdAt" | "rating" | "relevance";
  status?: MangaStatus;
  tagId?: string;
  title?: string;
  langs?: string[];
}

export async function listManga({
  page = 1,
  perPage = PER_PAGE,
  order = "followedCount",
  status,
  tagId,
  title,
  langs = LIST_LANGS,
}: ListOptions = {}): Promise<MangaListResponse> {
  const json = await md("/manga", {
    limit: perPage,
    offset: offsetFor(page, perPage),
    title,
    "status[]": status ? [status] : undefined,
    "includedTags[]": tagId ? [tagId] : undefined,
    "availableTranslatedLanguage[]": langs,
    "contentRating[]": CONTENT_RATING,
    "includes[]": MANGA_INCLUDES,
    [`order[${order}]`]: "desc",
    hasAvailableChapters: "true",
  });
  return toList(json, page, perPage);
}

/**
 * Hand-picked classics for the top of the homepage. Each id is the MangaDex
 * entry that still has readable chapters (chapter counts as of 2026-10-19);
 * several big titles have a dead main entry, e.g. One Piece only works in the
 * colored edition.
 */
const CLASSIC_IDS = [
  "a2c1d849-af05-4bbc-b2a7-866ebb10331f", // One Piece (colored), 763
  "d8a959f7-648e-4c8d-8f23-f1f3f8e129f3", // One Punch-Man, 64
  "ea3122bb-0c28-4669-8686-d6df1274512f", // Grappler Baki, 372
  "0b3f409c-2bda-40b7-9d1d-1039c0b7d62a", // Hanma Baki, 313
  "40bc649f-7b49-4645-859e-6cd94136e722", // Dragon Ball, 520
  "7f30dfc3-0b80-4dcc-a3b9-0cd746fac005", // Detective Conan, 923
  "e36da8b0-feca-46dd-9120-d5dc2f3feae8", // Doraemon, 765
  "db692d58-4b13-4174-ae8c-30c515c0689c", // Hunter x Hunter, 423
  "319df2e2-e6a6-4e3a-a31c-68539c140a84", // Slam Dunk, 278
  "a77742b1-befd-49a4-bff5-1ad4e6b0ef7b", // Chainsaw Man, 233
  "4141c5dc-c525-4df5-afd7-cc7d192a832f", // Blue Lock, 74
  "cfc3d743-bd89-48e2-991f-63e680cc4edf", // Dr. Stone, 112
];

export async function getClassicManga(): Promise<Manga[]> {
  const json = await md(
    "/manga",
    {
      limit: CLASSIC_IDS.length,
      "ids[]": CLASSIC_IDS,
      "contentRating[]": CONTENT_RATING,
      "includes[]": MANGA_INCLUDES,
    },
    3600
  );
  const found = new Map<string, Manga>();
  for (const item of json.data || []) found.set(item.id, normaliseManga(item));
  // MangaDex ignores the ids[] order, so restore ours
  return CLASSIC_IDS.flatMap((id) => found.get(id) || []);
}

export const getPopularManga = (page = 1, perPage = PER_PAGE) =>
  listManga({ page, perPage, order: "followedCount" });

export const getCompletedManga = (page = 1) =>
  listManga({ page, order: "followedCount", status: "completed" });

export const getMangaByTag = (tagId: string, page = 1) =>
  listManga({ page, order: "followedCount", tagId });

export const searchManga = (keyword: string, page = 1) =>
  listManga({ page, order: "relevance", title: keyword, langs: READ_LANGS });

const CHAPTER_BATCH = 100;

/**
 * Manga with the most recently uploaded Vietnamese chapters, each carrying
 * up to 3 of its newest chapters (NetTruyen-style "latest updates" grid).
 *
 * Driven by the global chapter feed rather than /manga: /chapter can only
 * filter by a single manga, and this way every listed manga is guaranteed to
 * have a readable chapter. Each page is one batch of 100 chapters.
 */
export async function getLatestUpdates(page = 1, perPage = PER_PAGE): Promise<MangaListResponse> {
  const json = await md(
    "/chapter",
    {
      limit: CHAPTER_BATCH,
      offset: offsetFor(page, CHAPTER_BATCH),
      "translatedLanguage[]": LIST_LANGS,
      "contentRating[]": CONTENT_RATING,
      "order[readableAt]": "desc",
      includeExternalUrl: 0,
      includeEmptyPages: 0,
    },
    120
  );

  // Bucket by manga, keeping the order in which each manga first appears.
  const byManga = new Map<string, ChapterInfo[]>();
  for (const c of json.data || []) {
    const mangaId = (c.relationships || []).find((r: any) => r.type === "manga")?.id;
    if (!mangaId) continue;
    const bucket = byManga.get(mangaId);
    if (!bucket) {
      if (byManga.size < perPage) byManga.set(mangaId, [normaliseChapter(c)]);
      continue;
    }
    const ch = normaliseChapter(c);
    // skip duplicate uploads of the same chapter number by different groups
    if (bucket.length < 3 && !bucket.some((b) => b.chapter === ch.chapter)) bucket.push(ch);
  }

  const pages = Math.ceil(Math.min(json.total || 0, MAX_OFFSET) / CHAPTER_BATCH);
  const result: MangaListResponse = { items: [], total: pages * perPage, page, perPage };
  if (byManga.size === 0) return result;

  const mangaJson = await md(
    "/manga",
    {
      limit: byManga.size,
      "ids[]": Array.from(byManga.keys()),
      "contentRating[]": CONTENT_RATING,
      "includes[]": MANGA_INCLUDES,
    },
    120
  );
  const found = new Map<string, Manga>();
  for (const item of mangaJson.data || []) found.set(item.id, normaliseManga(item));

  for (const [id, chapters] of Array.from(byManga)) {
    const m = found.get(id);
    if (!m) continue;
    m.latestChapters = chapters;
    result.items.push(m);
  }
  return result;
}

export async function getManga(id: string): Promise<Manga> {
  const json = await md(`/manga/${id}`, { "includes[]": MANGA_INCLUDES }, 600);
  return normaliseManga(json.data);
}

/**
 * Full readable chapter list, newest first. When both a Vietnamese and an
 * English release exist for the same chapter number, the Vietnamese one wins.
 */
export async function getChapters(mangaId: string): Promise<ChapterInfo[]> {
  const limit = 500;
  const raw: any[] = [];
  for (let offset = 0; offset < 2000; offset += limit) {
    const json = await md(
      `/manga/${mangaId}/feed`,
      {
        limit,
        offset,
        "translatedLanguage[]": READ_LANGS,
        "contentRating[]": CONTENT_RATING,
        "includes[]": ["scanlation_group"],
        "order[chapter]": "desc",
        includeExternalUrl: 0,
        includeEmptyPages: 0,
      },
      600
    );
    raw.push(...(json.data || []));
    if (offset + limit >= (json.total || 0)) break;
  }

  const rank = (lang: string) => {
    const i = READ_LANGS.indexOf(lang);
    return i === -1 ? READ_LANGS.length : i;
  };
  const best = new Map<string, ChapterInfo>();
  for (const c of raw.map(normaliseChapter)) {
    const key = c.chapter ?? `oneshot-${c.id}`;
    const cur = best.get(key);
    if (!cur || rank(c.lang) < rank(cur.lang) || (c.lang === cur.lang && c.publishAt > cur.publishAt)) {
      best.set(key, c);
    }
  }

  const num = (c: ChapterInfo) => (c.chapter === null ? -1 : parseFloat(c.chapter));
  return Array.from(best.values()).sort((a, b) => num(b) - num(a));
}

export async function getChapterPages(chapterId: string): Promise<ChapterPages> {
  const [chapterJson, atHome] = await Promise.all([
    md(`/chapter/${chapterId}`, {}, 600),
    // at-home tokens expire, but we only keep hash + filenames, which don't
    md(`/at-home/server/${chapterId}`, {}, 600),
  ]);
  const a = chapterJson.data?.attributes || {};
  const hash = atHome.chapter?.hash || "";
  return {
    id: chapterId,
    chapter: a.chapter ?? null,
    title: a.title || "",
    pages: (atHome.chapter?.dataSaver || []).map((f: string) => `${IMG_PROXY}/data-saver/${hash}/${f}`),
    pagesHd: (atHome.chapter?.data || []).map((f: string) => `${IMG_PROXY}/data/${hash}/${f}`),
  };
}

export async function getTags(): Promise<MangaTag[]> {
  const json = await md("/manga/tag", {}, 86400);
  return (json.data || [])
    .map(normaliseTag)
    .sort((a: MangaTag, b: MangaTag) => a.name.localeCompare(b.name, "vi"));
}
