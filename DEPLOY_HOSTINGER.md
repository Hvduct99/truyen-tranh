# Deploy GitHub -> Hostinger Business (Next.js fullstack)

Du an nay da gop backend (Express) vao Next.js API Routes.
Deploy truc tiep tu root repo.

## Cau truc

```
truyen_tranh/
  src/
    app/
      api/              <-- API routes (thay the backend Express)
        health/
        manga/
          featured/
          search/
          list/popular/
          list/latest/
          [id]/
          [id]/recommendations/
      page.tsx           <-- cac trang frontend
    lib/
      api.ts             <-- client goi API (fetch)
      mangaService.ts    <-- service goi Jikan API (logic tu backend)
    types/
      manga.ts
  backend/               <-- giu lai de tham khao, KHONG deploy
  package.json
  next.config.ts
```

## Cai dat tren Hostinger (GitHub deploy)

| Setting            | Gia tri                                    |
| ------------------ | ------------------------------------------ |
| Framework Preset   | Next.js                                    |
| Git repository     | https://github.com/Hvduct99/truyen-tranh   |
| Branch             | main                                       |
| Root directory     | / (root)                                   |
| Node.js version    | 20.x                                       |
| Build command      | npm install && npm run build               |
| Run command        | npm start                                  |
| Output directory   | .next                                      |
| Domain             | hathanh.blog                               |

## Environment Variables (dat tren Hostinger)

```
NEXT_PUBLIC_API_URL=https://hathanh.blog
JIKAN_API_URL=https://api.jikan.moe/v4
```

Giai thich:
- NEXT_PUBLIC_API_URL: URL cua chinh trang web (de server-side fetch goi API routes cua chinh no)
- JIKAN_API_URL: URL cua Jikan public API (nguon du lieu manga)

## Kiem tra sau deploy

1. https://hathanh.blog/api/health -> tra ve `{"status":"ok","timestamp":"..."}`
2. Trang chu load danh sach manga
3. Tim kiem hoat dong
4. Trang chi tiet manga mo duoc

## Loi hay gap

| Loi                  | Nguyen nhan                                         | Cach xu ly                                |
| -------------------- | --------------------------------------------------- | ----------------------------------------- |
| Build fail           | Node version < 20                                   | Chon Node.js 20.x tren Hostinger         |
| 500 khi goi API      | Thieu JIKAN_API_URL env                             | Them env tren Hostinger                   |
| Trang trang khi load | NEXT_PUBLIC_API_URL sai hoac thieu                  | Dat dung domain cua ban                   |
| Anh manga khong hien | next.config.ts thieu remotePatterns                 | Kiem tra config images                    |
| Rate limit tu Jikan  | Goi qua nhieu request                              | App tu dong dung fallback data            |

## Phat trien local

```bash
npm install
npm run dev
```

App chay tai http://localhost:3000, API routes tu dong hoat dong tai /api/*.
Khong can chay backend rieng nua.
