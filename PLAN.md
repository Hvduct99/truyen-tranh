# Plan: Chuyển đổi web review manga -> web ĐỌC truyện tranh

## Tổng quan
Thay toàn bộ Jikan API (chỉ review) bằng MangaDex API (đọc truyện thật).
User có thể: browse, search, xem chi tiết, và ĐỌC CHAPTER truyện tranh.

## MangaDex API Endpoints sử dụng
- `GET /manga?title=...&includes[]=cover_art` - tìm kiếm
- `GET /manga?order[followedCount]=desc&includes[]=cover_art` - popular
- `GET /manga?order[latestUploadedChapter]=desc&includes[]=cover_art` - latest
- `GET /manga/{id}?includes[]=cover_art&includes[]=author&includes[]=artist` - chi tiết
- `GET /manga/{id}/feed?translatedLanguage[]=vi&translatedLanguage[]=en&order[chapter]=asc` - danh sách chapter
- `GET /at-home/server/{chapterId}` - lấy URL ảnh các trang
- Cover: `https://uploads.mangadex.org/covers/{mangaId}/{fileName}`
- Pages: `{baseUrl}/data/{hash}/{filename}`

## Các file cần thay đổi

### 1. Types - `src/types/manga.ts` (REWRITE)
- MangaDex manga type (id UUID, title object, relationships)
- Chapter type
- ChapterPage type
- API response types

### 2. Service - `src/lib/mangaService.ts` (REWRITE)
- fetchPopularManga() - order by followedCount
- fetchLatestManga() - order by latestUploadedChapter
- searchManga(query) - search by title
- fetchMangaById(id) - detail with cover, author
- fetchChapters(mangaId) - chapter list (ưu tiên tiếng Việt, fallback English)
- fetchChapterPages(chapterId) - lấy ảnh các trang để đọc

### 3. API Routes - `src/app/api/manga/...` (REWRITE all + ADD new)
- Rewrite tất cả routes hiện tại cho MangaDex
- NEW: `src/app/api/manga/[id]/chapters/route.ts` - chapter list
- NEW: `src/app/api/manga/chapter/[chapterId]/pages/route.ts` - chapter pages

### 4. Client API - `src/lib/api.ts` (UPDATE)
- Update types và fetch functions cho data mới
- Thêm fetchChapters(), fetchChapterPages()

### 5. Pages (UPDATE all + ADD reader)
- `src/app/page.tsx` - Home: hiển thị manga mới + popular
- `src/app/popular/page.tsx` - Trang popular
- `src/app/latest/page.tsx` - Trang mới cập nhật
- `src/app/search/page.tsx` - Trang tìm kiếm
- `src/app/manga/[id]/page.tsx` - Chi tiết manga + DANH SÁCH CHAPTER
- NEW: `src/app/manga/[id]/chapter/[chapterId]/page.tsx` - **TRANG ĐỌC TRUYỆN**

### 6. Components (UPDATE + ADD new)
- Update: MangaCard, MangaGridSection, Navbar, HeroSection, SearchBar, Footer
- NEW: `ChapterList.tsx` - danh sách chapter
- NEW: `ChapterReader.tsx` - đọc truyện (scroll dọc + lật trang)
- NEW: `ReaderToolbar.tsx` - thanh công cụ reader (prev/next, zoom, mode)

### 7. Config
- `next.config.ts` - thêm domain `uploads.mangadex.org` cho ảnh
- `.env.example` - update MANGADEX_API_URL

## Tính năng Reader
- 2 chế độ đọc: cuộn dọc (webtoon) và lật từng trang
- Điều hướng bàn phím (mũi tên trái/phải)
- Nút prev/next chapter
- Giao diện tối (dark theme) phù hợp đọc truyện
- Responsive - đọc tốt trên điện thoại

## Thứ tự thực hiện
1. Types + mangaService.ts + API routes (backend/data layer)
2. api.ts client functions
3. Components mới (ChapterList, ChapterReader, ReaderToolbar)
4. Update components cũ (MangaCard, etc.)
5. Update/tạo pages
6. Config (next.config.ts, env)
