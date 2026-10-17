import MangaListPage, { parsePage } from "@/components/MangaListPage";
import { getMangaByTag, getTags } from "@/lib/mangaService";

export const dynamic = "force-dynamic";

interface GenreDetailPageProps {
  params: Promise<{ tagId: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function tagName(tagId: string) {
  try {
    return (await getTags()).find((t) => t.id === tagId)?.name || "Thể loại";
  } catch {
    return "Thể loại";
  }
}

export async function generateMetadata({ params }: GenreDetailPageProps) {
  return { title: `Truyện ${await tagName((await params).tagId)} | MangaVerse` };
}

export default async function GenreDetailPage({ params, searchParams }: GenreDetailPageProps) {
  const { tagId } = await params;
  const page = parsePage((await searchParams).page);
  return (
    <MangaListPage
      title={`Thể loại: ${await tagName(tagId)}`}
      page={page}
      baseUrl={`/genre/${tagId}`}
      load={() => getMangaByTag(tagId, page)}
    />
  );
}
