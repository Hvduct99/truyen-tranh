import Image from "next/image";
import Link from "next/link";
import ChapterList from "@/components/ChapterList";
import BookmarkButton from "@/components/BookmarkButton";
import { getMangaBySlug } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

interface MangaDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MangaDetailPageProps) {
  const { slug } = await params;
  try {
    const { manga } = await getMangaBySlug(slug);
    return {
      title: `${manga.name} | MangaVerse`,
      description: manga.description?.replace(/<[^>]*>/g, "").slice(0, 160) || `Đọc ${manga.name} online.`,
    };
  } catch {
    return { title: "Manga | MangaVerse" };
  }
}

export default async function MangaDetailPage({ params }: MangaDetailPageProps) {
  const { slug } = await params;

  try {
    const { manga, chapters } = await getMangaBySlug(slug);

    const statusClass = manga.status === "completed" ? "badge-completed" : "badge-ongoing";
    const statusText = manga.status === "completed" ? "Hoàn thành" : "Đang ra";

    const firstChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null;

    return (
      <div className="container-main pt-20 pb-12">
        <div className="card overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-56 lg:w-64 shrink-0 aspect-[3/4] bg-bg-hover">
              {manga.thumb_url && (
                <Image
                  src={manga.thumb_url}
                  alt={manga.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 256px"
                  className="object-cover"
                  priority
                  unoptimized
                />
              )}
            </div>
            <div className="flex-1 p-5 lg:p-6">
              <h1 className="text-2xl font-semibold text-txt leading-tight">{manga.name}</h1>
              {manga.origin_name.length > 0 && (
                <p className="mt-1 text-sm text-txt-muted line-clamp-1">{manga.origin_name[0]}</p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={statusClass}>{statusText}</span>
              </div>

              {manga.authors.length > 0 && (
                <div className="mt-3 text-sm">
                  <span className="text-txt-muted">Tác giả:</span>
                  <span className="ml-2 text-txt">{manga.authors.join(", ")}</span>
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {manga.categories.map((cat) => (
                  <Link key={cat.id} href={`/genre/${cat.slug}`} className="tag">
                    {cat.name}
                  </Link>
                ))}
              </div>

              {manga.description && (
                <div className="mt-4">
                  <p className="text-sm text-txt-secondary leading-relaxed line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: manga.description }}
                  />
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                {firstChapter && (
                  <Link
                    href={`/manga/${manga.slug}/${firstChapter.chapter_api_data}`}
                    className="btn-primary"
                  >
                    Đọc từ đầu
                  </Link>
                )}
                <BookmarkButton
                  mangaId={manga.slug}
                  mangaTitle={manga.name}
                  coverThumb={manga.thumb_url}
                  authors={manga.authors}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <ChapterList chapters={chapters} mangaSlug={manga.slug} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Manga detail error:", error);
    return (
      <div className="container-main pt-20 pb-12">
        <div className="card p-10 text-center">
          <p className="text-txt-secondary">Không thể tải thông tin truyện.</p>
          <Link href="/" className="btn-primary mt-4 inline-flex">Về trang chủ</Link>
        </div>
      </div>
    );
  }
}
