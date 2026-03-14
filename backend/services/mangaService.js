const axios = require("axios");
const NodeCache = require("node-cache");

const API_BASE = process.env.JIKAN_API_URL || "https://api.jikan.moe/v4";
const cache = new NodeCache({ stdTTL: 300 });

const FEATURED_TITLES = [
  "One Piece",
  "Naruto",
  "One Punch-Man",
  "Jujutsu Kaisen",
  "Berserk",
  "Vagabond",
  "Bleach",
  "Hunter x Hunter",
];

const FALLBACK_MANGA = [
  {
    id: "13",
    title: "One Piece",
    titleEnglish: "One Piece",
    titleJapanese: "ONE PIECE",
    synopsis:
      "Monkey D. Luffy lên đường chinh phục Grand Line để trở thành Vua Hải Tặc trong một hành trình dài hơi, vui nhộn và giàu cảm xúc.",
    background: "Fallback catalog data used when public API is rate-limited.",
    status: "Publishing",
    year: 1997,
    score: 9.2,
    scoredBy: null,
    rank: 1,
    popularity: 1,
    members: 500000,
    favorites: 120000,
    chapters: null,
    volumes: null,
    type: "Manga",
    demographic: "Shounen",
    genres: [{ id: "1", name: "Adventure" }, { id: "2", name: "Action" }],
    themes: [{ id: "101", name: "Pirates" }],
    authors: ["Eiichiro Oda"],
    serializations: ["Weekly Shounen Jump"],
    imageUrl: null,
    imageThumb: null,
    officialUrl: "https://myanimelist.net/manga/13/One_Piece",
  },
  {
    id: "11",
    title: "Naruto",
    titleEnglish: "Naruto",
    titleJapanese: "NARUTO -ナルト-",
    synopsis:
      "Naruto Uzumaki theo đuổi giấc mơ trở thành Hokage trong thế giới ninja khốc liệt nhưng đầy tình đồng đội.",
    background: "Fallback catalog data used when public API is rate-limited.",
    status: "Finished",
    year: 1999,
    score: 8.1,
    scoredBy: null,
    rank: 12,
    popularity: 2,
    members: 430000,
    favorites: 68000,
    chapters: 700,
    volumes: 72,
    type: "Manga",
    demographic: "Shounen",
    genres: [{ id: "1", name: "Action" }, { id: "2", name: "Adventure" }],
    themes: [{ id: "102", name: "Martial Arts" }],
    authors: ["Masashi Kishimoto"],
    serializations: ["Weekly Shounen Jump"],
    imageUrl: null,
    imageThumb: null,
    officialUrl: "https://myanimelist.net/manga/11/Naruto",
  },
  {
    id: "44347",
    title: "One Punch-Man",
    titleEnglish: "One-Punch Man",
    titleJapanese: "ワンパンマン",
    synopsis:
      "Saitama mạnh đến mức hạ gục mọi đối thủ chỉ bằng một cú đấm, kéo theo loạt bi kịch hài hước về ý nghĩa của sức mạnh tuyệt đối.",
    background: "Fallback catalog data used when public API is rate-limited.",
    status: "Publishing",
    year: 2012,
    score: 8.7,
    scoredBy: null,
    rank: 7,
    popularity: 3,
    members: 320000,
    favorites: 45000,
    chapters: null,
    volumes: null,
    type: "Manga",
    demographic: "Seinen",
    genres: [{ id: "1", name: "Action" }, { id: "2", name: "Comedy" }],
    themes: [{ id: "103", name: "Super Power" }],
    authors: ["ONE", "Yusuke Murata"],
    serializations: ["Tonari no Young Jump"],
    imageUrl: null,
    imageThumb: null,
    officialUrl: "https://myanimelist.net/manga/44347/One_Punch-Man",
  },
  {
    id: "113138",
    title: "Jujutsu Kaisen",
    titleEnglish: "Jujutsu Kaisen",
    titleJapanese: "呪術廻戦",
    synopsis:
      "Yuji Itadori bị cuốn vào thế giới chú thuật sau khi nuốt phải vật thể nguyền rủa, mở ra chuỗi trận chiến đậm nhịp hiện đại.",
    background: "Fallback catalog data used when public API is rate-limited.",
    status: "Finished",
    year: 2018,
    score: 8.5,
    scoredBy: null,
    rank: 10,
    popularity: 5,
    members: 290000,
    favorites: 40000,
    chapters: 271,
    volumes: 30,
    type: "Manga",
    demographic: "Shounen",
    genres: [{ id: "1", name: "Action" }, { id: "2", name: "Supernatural" }],
    themes: [{ id: "104", name: "School" }],
    authors: ["Gege Akutami"],
    serializations: ["Weekly Shounen Jump"],
    imageUrl: null,
    imageThumb: null,
    officialUrl: "https://myanimelist.net/manga/113138/Jujutsu_Kaisen",
  },
  {
    id: "2",
    title: "Berserk",
    titleEnglish: "Berserk",
    titleJapanese: "ベルセルク",
    synopsis:
      "Guts đi xuyên một thế giới fantasy tăm tối với nỗi đau, thù hận và ý chí sinh tồn gần như không thể phá vỡ.",
    background: "Fallback catalog data used when public API is rate-limited.",
    status: "Publishing",
    year: 1989,
    score: 9.4,
    scoredBy: null,
    rank: 2,
    popularity: 6,
    members: 260000,
    favorites: 97000,
    chapters: null,
    volumes: null,
    type: "Manga",
    demographic: "Seinen",
    genres: [{ id: "1", name: "Action" }, { id: "2", name: "Drama" }],
    themes: [{ id: "105", name: "Psychological" }],
    authors: ["Kentaro Miura"],
    serializations: ["Young Animal"],
    imageUrl: null,
    imageThumb: null,
    officialUrl: "https://myanimelist.net/manga/2/Berserk",
  },
  {
    id: "656",
    title: "Vagabond",
    titleEnglish: "Vagabond",
    titleJapanese: "バガボンド",
    synopsis:
      "Cuộc đời Miyamoto Musashi được tái hiện bằng nét vẽ đỉnh cao và nhịp triết lý sâu về con đường kiếm sĩ.",
    background: "Fallback catalog data used when public API is rate-limited.",
    status: "Hiatus",
    year: 1998,
    score: 9.2,
    scoredBy: null,
    rank: 3,
    popularity: 11,
    members: 180000,
    favorites: 54000,
    chapters: 327,
    volumes: 37,
    type: "Manga",
    demographic: "Seinen",
    genres: [{ id: "1", name: "Action" }, { id: "2", name: "Historical" }],
    themes: [{ id: "106", name: "Samurai" }],
    authors: ["Takehiko Inoue"],
    serializations: ["Morning"],
    imageUrl: null,
    imageThumb: null,
    officialUrl: "https://myanimelist.net/manga/656/Vagabond",
  },
  {
    id: "12",
    title: "Bleach",
    titleEnglish: "Bleach",
    titleJapanese: "BLEACH",
    synopsis:
      "Ichigo Kurosaki trở thành Shinigami thay thế và bị cuốn vào xung đột giữa linh hồn, Hollow và Soul Society.",
    background: "Fallback catalog data used when public API is rate-limited.",
    status: "Finished",
    year: 2001,
    score: 7.9,
    scoredBy: null,
    rank: 28,
    popularity: 9,
    members: 220000,
    favorites: 31000,
    chapters: 686,
    volumes: 74,
    type: "Manga",
    demographic: "Shounen",
    genres: [{ id: "1", name: "Action" }, { id: "2", name: "Supernatural" }],
    themes: [{ id: "107", name: "Mythology" }],
    authors: ["Tite Kubo"],
    serializations: ["Weekly Shounen Jump"],
    imageUrl: null,
    imageThumb: null,
    officialUrl: "https://myanimelist.net/manga/12/Bleach",
  },
  {
    id: "26",
    title: "Hunter x Hunter",
    titleEnglish: "Hunter x Hunter",
    titleJapanese: "HUNTER×HUNTER",
    synopsis:
      "Gon Freecss bước vào kỳ thi Hunter để tìm cha và dần lột ra những tầng nghĩa rất tối phía sau một thế giới tưởng như phiêu lưu trẻ trung.",
    background: "Fallback catalog data used when public API is rate-limited.",
    status: "Publishing",
    year: 1998,
    score: 8.8,
    scoredBy: null,
    rank: 6,
    popularity: 8,
    members: 250000,
    favorites: 52000,
    chapters: null,
    volumes: 38,
    type: "Manga",
    demographic: "Shounen",
    genres: [{ id: "1", name: "Adventure" }, { id: "2", name: "Fantasy" }],
    themes: [{ id: "108", name: "Strategy" }],
    authors: ["Yoshihiro Togashi"],
    serializations: ["Weekly Shounen Jump"],
    imageUrl: null,
    imageThumb: null,
    officialUrl: "https://myanimelist.net/manga/26/Hunter_x_Hunter",
  },
];

const mangaApi = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "User-Agent": "TruyenTranhCatalog/1.0",
  },
});

function stripHtml(value) {
  return (value || "").replace(/<[^>]*>/g, "").trim();
}

function normalizeManga(item) {
  return {
    id: String(item.mal_id),
    title: item.title,
    titleEnglish: item.title_english || item.title,
    titleJapanese: item.title_japanese || null,
    synopsis: stripHtml(item.synopsis),
    background: stripHtml(item.background),
    status: item.status || "Unknown",
    year: item.published?.prop?.from?.year || null,
    score: item.score || null,
    scoredBy: item.scored_by || null,
    rank: item.rank || null,
    popularity: item.popularity || null,
    members: item.members || null,
    favorites: item.favorites || null,
    chapters: item.chapters || null,
    volumes: item.volumes || null,
    type: item.type || "Manga",
    demographic: item.demographics?.[0]?.name || null,
    genres: (item.genres || []).map((genre) => ({
      id: String(genre.mal_id),
      name: genre.name,
    })),
    themes: (item.themes || []).map((theme) => ({
      id: String(theme.mal_id),
      name: theme.name,
    })),
    authors: (item.authors || []).map((author) => author.name),
    serializations: (item.serializations || []).map((entry) => entry.name),
    imageUrl:
      item.images?.webp?.large_image_url ||
      item.images?.jpg?.large_image_url ||
      item.images?.jpg?.image_url ||
      null,
    imageThumb:
      item.images?.webp?.image_url ||
      item.images?.jpg?.image_url ||
      null,
    officialUrl: item.url || null,
  };
}

function buildListResponse(payload, page, limit) {
  return {
    data: payload.data.map(normalizeManga),
    pagination: payload.pagination,
    page,
    limit,
  };
}

async function requestWithFallback(requestFactory, fallbackValue, cacheKey, ttl = 300) {
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const result = await requestFactory();
    cache.set(cacheKey, result, ttl);
    return result;
  } catch (error) {
    const status = error.response?.status;
    console.error(`External manga API failure (${cacheKey}):`, status || error.message);
    cache.set(cacheKey, fallbackValue, 120);
    return fallbackValue;
  }
}

async function getFeaturedManga() {
  const cacheKey = "featured_manga";
  const fallback = { data: FALLBACK_MANGA, total: FALLBACK_MANGA.length };

  return requestWithFallback(async () => {
    const results = await Promise.all(
      FEATURED_TITLES.map(async (title) => {
        const response = await mangaApi.get("/manga", {
          params: {
            q: title,
            limit: 1,
            order_by: "popularity",
            sort: "asc",
            sfw: true,
          },
        });

        return response.data.data[0] || null;
      })
    );

    const data = results.filter(Boolean).map(normalizeManga);
    return { data, total: data.length };
  }, fallback, cacheKey, 1800);
}

async function searchManga(query, limit = 20, page = 1) {
  const cacheKey = `search_${query}_${limit}_${page}`;
  const filtered = FALLBACK_MANGA.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
  const fallback = {
    data: filtered,
    page,
    limit,
    pagination: {
      current_page: 1,
      has_next_page: false,
      last_visible_page: 1,
      items: {
        count: filtered.length,
        total: filtered.length,
        per_page: limit,
      },
    },
  };

  return requestWithFallback(async () => {
    const response = await mangaApi.get("/manga", {
      params: {
        q: query,
        limit: Math.min(limit, 24),
        page,
        order_by: "score",
        sort: "desc",
        sfw: true,
      },
    });

    return buildListResponse(response.data, page, limit);
  }, fallback, cacheKey, 300);
}

async function getMangaById(id) {
  const cacheKey = `manga_${id}`;
  const fallback =
    FALLBACK_MANGA.find((item) => item.id === String(id)) || FALLBACK_MANGA[0];

  return requestWithFallback(async () => {
    const response = await mangaApi.get(`/manga/${encodeURIComponent(id)}/full`);
    return normalizeManga(response.data.data);
  }, fallback, cacheKey, 1800);
}

async function getPopularManga(limit = 24, page = 1) {
  const cacheKey = `popular_${limit}_${page}`;
  const fallback = {
    data: FALLBACK_MANGA.slice(0, Math.min(limit, FALLBACK_MANGA.length)),
    page,
    limit,
    pagination: {
      current_page: 1,
      has_next_page: false,
      last_visible_page: 1,
      items: {
        count: Math.min(limit, FALLBACK_MANGA.length),
        total: FALLBACK_MANGA.length,
        per_page: limit,
      },
    },
  };

  return requestWithFallback(async () => {
    const response = await mangaApi.get("/top/manga", {
      params: {
        limit: Math.min(limit, 24),
        page,
        filter: "publishing",
        sfw: true,
      },
    });

    return buildListResponse(response.data, page, limit);
  }, fallback, cacheKey, 600);
}

async function getLatestManga(limit = 24, page = 1) {
  const cacheKey = `latest_${limit}_${page}`;
  const fallback = {
    data: [...FALLBACK_MANGA].reverse().slice(0, Math.min(limit, FALLBACK_MANGA.length)),
    page,
    limit,
    pagination: {
      current_page: 1,
      has_next_page: false,
      last_visible_page: 1,
      items: {
        count: Math.min(limit, FALLBACK_MANGA.length),
        total: FALLBACK_MANGA.length,
        per_page: limit,
      },
    },
  };

  return requestWithFallback(async () => {
    const response = await mangaApi.get("/manga", {
      params: {
        limit: Math.min(limit, 24),
        page,
        order_by: "start_date",
        sort: "desc",
        type: "manga",
        sfw: true,
      },
    });

    return buildListResponse(response.data, page, limit);
  }, fallback, cacheKey, 600);
}

async function getMangaRecommendations(id) {
  const cacheKey = `recommendations_${id}`;
  const fallback = {
    data: FALLBACK_MANGA.filter((item) => item.id !== String(id))
      .slice(0, 4)
      .map((item, index) => ({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        votes: 100 - index * 7,
        officialUrl: item.officialUrl,
      })),
  };

  return requestWithFallback(async () => {
    const response = await mangaApi.get(
      `/manga/${encodeURIComponent(id)}/recommendations`
    );

    return {
      data: (response.data.data || []).slice(0, 8).map((entry) => ({
        id: String(entry.entry.mal_id),
        title: entry.entry.title,
        imageUrl:
          entry.entry.images?.webp?.large_image_url ||
          entry.entry.images?.jpg?.large_image_url ||
          entry.entry.images?.jpg?.image_url ||
          null,
        votes: entry.votes || 0,
        officialUrl: entry.entry.url || null,
      })),
    };
  }, fallback, cacheKey, 1800);
}

module.exports = {
  getFeaturedManga,
  searchManga,
  getMangaById,
  getPopularManga,
  getLatestManga,
  getMangaRecommendations,
};
