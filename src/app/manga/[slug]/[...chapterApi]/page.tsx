import Link from "next/link";
import ChapterReader from "@/components/ChapterReader";
import { getChapterDetail, getMangaBySlug } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

interface ChapterPageProps {
  params: Promise<{ slug: string; chapterApi: string[] }>;
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { slug, chapterApi } = await params;
  const apiUrl = chapterApi.join("/");
  try {
    const [{ manga }, chapter] = await Promise.all([
      getMangaBySlug(slug),
      getChapterDetail(apiUrl),
    ]);
    return {
      title: `Ch.${chapter.chapter_name} | ${manga.name} | MangaVerse`,
    };
  } catch {
    return { title: "Chapter | MangaVerse" };
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug, chapterApi } = await params;
  const apiUrl = chapterApi.join("/");

  try {
    const [{ manga, chapters }, chapter] = await Promise.all([
      getMangaBySlug(slug),
      getChapterDetail(apiUrl),
    ]);

    // Find current chapter index and prev/next
    const currentIndex = chapters.findIndex(
      (ch) => ch.chapter_name === chapter.chapter_name
    );
    const prevChapterApi = currentIndex < chapters.length - 1
      ? chapters[currentIndex + 1].chapter_api_data
      : null;
    const nextChapterApi = currentIndex > 0
      ? chapters[currentIndex - 1].chapter_api_data
      : null;

    return (
      <div className="-mt-14">
        <ChapterReader
          chapter={chapter}
          mangaSlug={slug}
          mangaName={manga.name}
          mangaThumb={manga.thumb_url}
          prevChapterApi={prevChapterApi}
          nextChapterApi={nextChapterApi}
        />
      </div>
    );
  } catch (error) {
    console.error("Chapter page error:", error);
    return (
      <div className="container-main pt-20 pb-12">
        <div className="card p-10 text-center">
          <p className="text-txt-secondary">Không thể tải chapter.</p>
          <Link href={`/manga/${slug}`} className="btn-primary mt-4 inline-flex">Quay lại</Link>
        </div>
      </div>
    );
  }
}
