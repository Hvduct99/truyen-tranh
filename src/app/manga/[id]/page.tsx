import Image from "next/image";
import Link from "next/link";
import ChapterList from "@/components/ChapterList";
import BookmarkButton from "@/components/BookmarkButton";
import { getMangaById, getChapters } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

interface MangaDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MangaDetailPageProps) {
  const { id } = await params;
  try {
    const manga = await getMangaById(id);
    return {
      title: `${manga.title} | MangaVerse`,
      description: manga.description?.slice(0, 160) || `Đọc ${manga.title} online.`,
    };
  } catch {
    return { title: "Manga | MangaVerse" };
  }
}

export default async function MangaDetailPage({ params }: MangaDetailPageProps) {
  const { id } = await params;

  try {
    const [manga, chaptersData] = await Promise.all([
      getMangaById(id),
      getChapters(id, 96),
    ]);

    const firstChapter = chaptersData.data[0];

    const statusClass =
      manga.status === "completed"
        ? "badge-completed"
        : manga.status === "hiatus"
        ? "badge-hiatus"
        : "badge-ongoing";

    const statusText =
      manga.status === "completed"
        ? "Hoàn thành"
        : manga.status === "ongoing"
        ? "Đang ra"
        : manga.status === "hiatus"
        ? "Tạm ngưng"
        : manga.status;

    return (
      <div className="container-main pt-20 pb-12">
        {/* Header */}
        <div className="card overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Cover */}
            <div className="relative w-full md:w-56 lg:w-64 shrink-0 aspect-[3/4] bg-bg-hover">
              {manga.coverUrl && (
                <Image
                  src={manga.coverUrl}
                  alt={manga.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 256px"
                  className="object-cover"
                  priority
                  unoptimized
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 p-5 lg:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold text-txt leading-tight">
                    {manga.title}
                  </h1>
                  {manga.altTitles.length > 0 && (
                    <p className="mt-1 text-sm text-txt-muted line-clamp-1">
                      {manga.altTitles[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Meta */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={statusClass}>{statusText}</span>
                {manga.year && (
                  <span className="badge bg-bg-hover text-txt-secondary">{manga.year}</span>
                )}
                <span className="badge bg-bg-hover text-txt-secondary capitalize">
                  {manga.contentRating}
                </span>
              </div>

              {/* Authors */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-txt-muted">Tác giả:</span>
                  <span className="ml-2 text-txt">
                    {manga.authors.join(", ") || "Đang cập nhật"}
                  </span>
                </div>
                <div>
                  <span className="text-txt-muted">Họa sĩ:</span>
                  <span className="ml-2 text-txt">
                    {manga.artists.join(", ") || "Đang cập nhật"}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {manga.tags.map((tag) => (
                  <Link key={tag.id} href={`/genre/${tag.id}`} className="tag">
                    {tag.name}
                  </Link>
                ))}
              </div>

              {/* Description */}
              <div className="mt-4">
                <p className="text-sm text-txt-secondary leading-relaxed line-clamp-4">
                  {manga.description || "Chưa có mô tả cho manga này."}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-3">
                {firstChapter && (
                  <Link
                    href={`/manga/${manga.id}/chapter/${firstChapter.id}`}
                    className="btn-primary"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Đọc từ đầu
                  </Link>
                )}
                <BookmarkButton
                  mangaId={manga.id}
                  mangaTitle={manga.title}
                  coverThumb={manga.coverThumb}
                  authors={manga.authors}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chapter list */}
        <div className="mt-6">
          <ChapterList
            chapters={chaptersData.data}
            mangaId={manga.id}
            total={chaptersData.total}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Manga detail error:", error);
    return (
      <div className="container-main pt-20 pb-12">
        <div className="card p-10 text-center">
          <p className="text-txt-secondary">Không thể tải thông tin manga. Vui lòng thử lại sau.</p>
          <Link href="/" className="btn-primary mt-4 inline-flex">Về trang chủ</Link>
        </div>
      </div>
    );
  }
}
