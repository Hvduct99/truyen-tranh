import ChapterReader from "@/components/ChapterReader";
import ErrorBox from "@/components/ErrorBox";
import { getChapterPages, getChapters, getManga } from "@/lib/mangaService";
import { chapterLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

interface ChapterPageProps {
  params: Promise<{ id: string; chapterId: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { id, chapterId } = await params;
  try {
    const [manga, chapter] = await Promise.all([getManga(id), getChapterPages(chapterId)]);
    return { title: `${manga.title} ${chapterLabel(chapter)} | MangaVerse` };
  } catch {
    return { title: "Đọc truyện | MangaVerse" };
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id, chapterId } = await params;

  try {
    const [manga, chapters, chapter] = await Promise.all([getManga(id), getChapters(id), getChapterPages(chapterId)]);

    // chapters are newest first: "previous" is the next index, "next" the one before
    const index = chapters.findIndex((c) => c.id === chapterId);
    const prevId = index >= 0 && index < chapters.length - 1 ? chapters[index + 1].id : null;
    const nextId = index > 0 ? chapters[index - 1].id : null;

    const options = chapters.map((c) => ({ id: c.id, label: chapterLabel(c) }));
    // a chapter replaced by another language release won't be in the list; still let it show
    if (index === -1) options.unshift({ id: chapter.id, label: chapterLabel(chapter) });

    return (
      <ChapterReader
        chapter={chapter}
        mangaId={manga.id}
        mangaTitle={manga.title}
        mangaCover={manga.cover}
        chapterOptions={options}
        prevId={prevId}
        nextId={nextId}
      />
    );
  } catch (error) {
    console.error("Chapter page error:", error);
    return <ErrorBox message="Không thể tải chương này." backHref={`/manga/${id}`} backLabel="Quay lại truyện" />;
  }
}
