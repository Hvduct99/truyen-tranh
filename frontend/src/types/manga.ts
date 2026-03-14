export interface MangaTag {
  id: string;
  name: string;
}

export interface Manga {
  id: string;
  title: string;
  titleEnglish: string;
  titleJapanese: string | null;
  synopsis: string;
  background: string;
  status: string;
  year: number | null;
  score: number | null;
  scoredBy: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  chapters: number | null;
  volumes: number | null;
  type: string;
  demographic: string | null;
  genres: MangaTag[];
  themes: MangaTag[];
  authors: string[];
  serializations: string[];
  imageUrl: string | null;
  imageThumb: string | null;
  officialUrl: string | null;
}

export interface Recommendation {
  id: string;
  title: string;
  imageUrl: string | null;
  votes: number;
  officialUrl: string | null;
}

export interface MangaListResponse {
  data: Manga[];
  total?: number;
  page?: number;
  limit?: number;
  pagination?: {
    has_next_page?: boolean;
    current_page?: number;
    last_visible_page?: number;
    items?: {
      count?: number;
      total?: number;
      per_page?: number;
    };
  };
}

export interface RecommendationResponse {
  data: Recommendation[];
}
