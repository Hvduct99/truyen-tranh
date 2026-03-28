import ChapterReader from "@/components/ChapterReader";
import { getChapterPages, getChapters, getMangaById } from "@/lib/api";

export const dynamic = "force-dynamic";

interface ChapterPageProps {
  params: Promise<{ id: string; chapterId: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { id, chapterId } = await params;
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
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id, chapterId } = await params;

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
}
