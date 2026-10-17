import { NextRequest } from "next/server";

/*
 * Image proxy for MangaDex covers and chapter pages.
 *
 * Vietnamese ISPs block uploads.mangadex.org, so the browser loads
 * /api/img/<path> from us and we fetch the real file server-side.
 * Only the three MangaDex upload folders are allowed, so this can't be
 * used as an open proxy.
 */
const UPLOADS = process.env.MANGADEX_UPLOADS_BASE || "https://uploads.mangadex.org";
const ALLOWED_ROOTS = new Set(["covers", "data", "data-saver"]);
const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (!path?.length || !ALLOWED_ROOTS.has(path[0]) || !path.every((s) => SAFE_SEGMENT.test(s) && s !== "..")) {
    return new Response("Not found", { status: 404 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${UPLOADS}/${path.join("/")}`, {
      headers: { "User-Agent": "MangaVerse/1.0 (+https://truyentranh.store)" },
      cache: "no-store", // images are cached by the browser/CDN instead
    });
  } catch {
    return new Response("Upstream unreachable", { status: 502 });
  }
  const type = upstream.headers.get("content-type") || "";
  if (!upstream.ok || !type.startsWith("image/")) {
    return new Response("Not found", { status: upstream.status === 200 ? 502 : upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": type,
      // filenames are content hashes, so they never change
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
