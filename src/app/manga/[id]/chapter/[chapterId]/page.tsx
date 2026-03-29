import Link from "next/link";
import ChapterReader from "@/components/ChapterReader";
import { getChapterPages, getChapters, getMangaById } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

interface ChapterPageProps {
  params: Promise<{ id: string; chapterId: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { id, chapterId } = await params;
  try {
    const [manga, chaptersData] = await Promise.all([
      getMangaById(id),
      getChapters(id, 500),
    ]);
    const chapter = chaptersData.data.find((c) => c.id === chapterId);
    const chTitle = chapter
      ? `Ch.${chapter.chapter || "?"}${chapter.title ? ` - ${chapter.title}` : ""}`
      : "Reader";
    return {
      title: `${chTitle} | ${manga.title} | MangaVerse`,
    };
  } catch {
    return { title: "Chapter | MangaVerse" };
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id, chapterId } = await params;

  try {
    const [manga, chaptersData, pagesData] = await Promise.all([
      getMangaById(id),
      getChapters(id, 500),
      getChapterPages(chapterId),
    ]);

    const chapters = chaptersData.data;
    const currentIndex = chapters.findIndex((c) => c.id === chapterId);
    const current = chapters[currentIndex];

    const prevChapterId = currentIndex > 0 ? chapters[currentIndex - 1].id : null;
    const nextChapterId =
      currentIndex < chapters.length - 1 ? chapters[currentIndex + 1].id : null;

    const chapterNum = current?.chapter || "?";
    const chapterTitle = current
      ? `Chapter ${chapterNum}${current.title ? `: ${current.title}` : ""}`
      : "Chapter";

    return (
      <div className="-mt-14">
        <ChapterReader
          pages={pagesData.pages}
          chapterTitle={chapterTitle}
          chapterNum={chapterNum}
          mangaId={id}
          mangaTitle={manga.title}
          mangaCover={manga.coverThumb}
          prevChapterId={prevChapterId}
          nextChapterId={nextChapterId}
          currentChapterId={chapterId}
        />
      </div>
    );
  } catch (error) {
    console.error("Chapter page error:", error);
    return (
      <div className="container-main pt-20 pb-12">
        <div className="card p-10 text-center">
          <p className="text-txt-secondary">Không thể tải chapter. Vui lòng thử lại sau.</p>
          <Link href={`/manga/${id}`} className="btn-primary mt-4 inline-flex">Quay lại</Link>
        </div>
      </div>
    );
  }
}
