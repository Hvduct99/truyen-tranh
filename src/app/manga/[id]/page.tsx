import Link from "next/link";
import ChapterList from "@/components/ChapterList";
import BookmarkButton from "@/components/BookmarkButton";
import CoverImage from "@/components/CoverImage";
import ErrorBox from "@/components/ErrorBox";
import { StatusBadge } from "@/components/MangaCard";
import { getManga, getChapters } from "@/lib/mangaService";
import { chapterLabel } from "@/lib/format";
import type { ReactNode } from "react";
import { ChapterInfo } from "@/types/manga";

export const dynamic = "force-dynamic";

interface MangaDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MangaDetailPageProps) {
  const { id } = await params;
  try {
    const manga = await getManga(id);
    return {
      title: `${manga.title} | MangaVerse`,
      description: manga.description.slice(0, 160) || `Đọc truyện ${manga.title} online.`,
    };
  } catch {
    return { title: "Truyện | MangaVerse" };
  }
}

export default async function MangaDetailPage({ params }: MangaDetailPageProps) {
  const { id } = await params;

  const [mangaRes, chaptersRes] = await Promise.allSettled([getManga(id), getChapters(id)]);
  if (mangaRes.status === "rejected") {
    console.error("Manga detail error:", mangaRes.reason);
    return <ErrorBox message="Không tìm thấy truyện hoặc MangaDex đang lỗi." />;
  }
  const manga = mangaRes.value;
  const chapters: ChapterInfo[] = chaptersRes.status === "fulfilled" ? chaptersRes.value : [];
  const first = chapters[chapters.length - 1];
  const newest = chapters[0];
  const genres = manga.tags.filter((t) => t.group === "genre" || t.group === "theme");

  const infoRow = (label: string, value: ReactNode) => (
    <div className="flex gap-3 py-1.5">
      <dt className="w-24 shrink-0 text-txt-muted">{label}</dt>
      <dd className="text-txt min-w-0">{value}</dd>
    </div>
  );

  return (
    <div className="container-main py-4 space-y-4">
      <nav className="text-xs text-txt-muted">
        <Link href="/" className="text-link hover:underline">Trang chủ</Link> › <span>{manga.title}</span>
      </nav>

      <section className="card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="relative w-44 sm:w-52 shrink-0 mx-auto sm:mx-0 aspect-[3/4] rounded-md overflow-hidden shadow-md">
            <CoverImage src={manga.cover} alt={manga.title} eager className="absolute inset-0 w-full h-full" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-txt leading-tight text-center sm:text-left">{manga.title}</h1>
            {manga.altTitle && <p className="mt-1 text-sm text-txt-muted text-center sm:text-left">{manga.altTitle}</p>}

            <dl className="mt-3 text-sm divide-y divide-border/60">
              {manga.authors.length > 0 && infoRow("Tác giả", manga.authors.join(", "))}
              {infoRow("Tình trạng", <StatusBadge status={manga.status} />)}
              {manga.year && infoRow("Năm", manga.year)}
              {infoRow("Số chương", chapters.length > 0 ? `${chapters.length} chương đọc được` : "Chưa có")}
            </dl>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {genres.map((t) => (
                <Link key={t.id} href={`/genre/${t.id}`} className="tag">{t.name}</Link>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {first && <Link href={`/manga/${manga.id}/${first.id}`} className="btn-primary">Đọc từ đầu</Link>}
              {newest && newest !== first && (
                <Link href={`/manga/${manga.id}/${newest.id}`} className="btn-primary !bg-[#2563eb] hover:!bg-[#1d4ed8]">
                  Đọc mới nhất ({chapterLabel(newest)})
                </Link>
              )}
              <BookmarkButton mangaId={manga.id} mangaTitle={manga.title} coverThumb={manga.cover} authors={manga.authors} />
            </div>
          </div>
        </div>

        {manga.description && (
          <div className="mt-5 pt-4 border-t border-border">
            <h2 className="section-title !text-base mb-2">Nội dung</h2>
            <p className="text-sm text-txt-secondary leading-relaxed whitespace-pre-line">{manga.description}</p>
          </div>
        )}
      </section>

      {chaptersRes.status === "rejected" ? (
        <div className="card p-8 text-center text-sm text-txt-muted">Không tải được danh sách chương. Tải lại trang để thử lại.</div>
      ) : (
        <ChapterList chapters={chapters} mangaId={manga.id} />
      )}
    </div>
  );
}
