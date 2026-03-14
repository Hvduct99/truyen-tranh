# Deploy GitHub -> Hostinger (Next.js + Node.js)

Tai lieu nay dung cho monorepo gom:

- frontend: Next.js
- backend: Node.js Express API

## 1) Cau truc khuyen nghi cho Hostinger

Giu nguyen 2 app tach rieng trong 1 repo:

- frontend chay o domain chinh: https://domain.com
- backend chay o subdomain API: https://api.domain.com

Ly do:

- deploy doc lap, rollback de hon
- khong phai tron Next server va API server vao cung mot process
- CORS, env va SSL ro rang

## 2) Ket noi repo GitHub

Chay tai thu muc goc du an:

1. git init
2. git branch -M main
3. git remote add origin https://github.com/Hvduct99/truyen-tranh.git
4. git add .
5. git commit -m "chore: prepare hostinger deployment"
6. git push -u origin main

Neu da co remote origin truoc do thi dung:

- git remote set-url origin https://github.com/Hvduct99/truyen-tranh.git

## 3) Cai dat tren Hostinger (2 app)

Tao 2 Node.js App trong Hostinger:

### App A - Backend API

- Git repository: https://github.com/Hvduct99/truyen-tranh
- Branch: main
- Application root: backend
- Build command: npm install
- Start command: npm start
- Domain: api.domain.com

Environment variables:

- NODE_ENV=production
- PORT=5000
- FRONTEND_URL=https://domain.com
- JIKAN_API_URL=https://api.jikan.moe/v4

Health check:

- https://api.domain.com/api/health

### App B - Frontend Next.js

- Git repository: https://github.com/Hvduct99/truyen-tranh
- Branch: main
- Application root: frontend
- Build command: npm install ; npm run build
- Start command: npm start
- Domain: domain.com

Environment variables:

- NEXT_PUBLIC_API_URL=https://api.domain.com

## 4) DNS can co

- Ban ghi cho domain chinh tro vao app frontend
- Ban ghi cho api.domain.com tro vao app backend

## 5) Kiem tra sau deploy

1. API health tra ve JSON status ok
2. Trang home load danh sach manga
3. Search hoat dong
4. Trang chi tiet manga mo duoc

## 6) Loi hay gap va cach xu ly

- CORS error: kiem tra FRONTEND_URL backend co dung domain frontend
- Frontend goi sai API: kiem tra NEXT_PUBLIC_API_URL
- Build fail do Node version: dat Node >= 20 tren Hostinger
- 502/503 sau deploy: xem log app backend/frontend, restart app

## 7) Luu y van hanh

- Day la trang catalog metadata tu public API (Jikan), khong host noi dung scan
- Neu traffic tang, nen bo sung reverse proxy cache (Nginx/Cloudflare)
