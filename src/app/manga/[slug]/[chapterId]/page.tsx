import Link from "next/link";
import ChapterReader from "@/components/ChapterReader";
import {
  getChapterDetail,
  getMangaBySlug,
  buildChapterApiUrl,
  extractChapterId,
} from "@/lib/mangaService";

export const dynamic = "force-dynamic";

interface ChapterPageProps {
  params: Promise<{ slug: string; chapterId: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { slug, chapterId } = await params;
  try {
    const [{ manga }, chapter] = await Promise.all([
      getMangaBySlug(slug),
      getChapterDetail(buildChapterApiUrl(chapterId)),
    ]);
    return {
      title: `Ch.${chapter.chapter_name} | ${manga.name} | MangaVerse`,
    };
  } catch {
    return { title: "Chapter | MangaVerse" };
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug, chapterId } = await params;

  try {
    const [{ manga, chapters }, chapter] = await Promise.all([
      getMangaBySlug(slug),
      getChapterDetail(buildChapterApiUrl(chapterId)),
    ]);

    // Find current chapter and get prev/next IDs
    const currentIndex = chapters.findIndex(
      (ch) => extractChapterId(ch.chapter_api_data) === chapterId
    );

    // chapters array: index 0 = newest, last = oldest
    const prevChapterId =
      currentIndex < chapters.length - 1
        ? extractChapterId(chapters[currentIndex + 1].chapter_api_data)
        : null;
    const nextChapterId =
      currentIndex > 0
        ? extractChapterId(chapters[currentIndex - 1].chapter_api_data)
        : null;

    return (
      <div className="-mt-14">
        <ChapterReader
          chapter={chapter}
          mangaSlug={slug}
          mangaName={manga.name}
          mangaThumb={manga.thumb_url}
          prevChapterId={prevChapterId}
          nextChapterId={nextChapterId}
        />
      </div>
    );
  } catch (error) {
    console.error("Chapter page error:", error);
    return (
      <div className="container-main pt-20 pb-12">
        <div className="card p-10 text-center">
          <p className="text-txt-secondary">Không thể tải chapter.</p>
          <Link href={`/manga/${slug}`} className="btn-primary mt-4 inline-flex">
            Quay lại
          </Link>
        </div>
      </div>
    );
  }
}
