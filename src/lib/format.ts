import type { MangaStatus } from "@/types/manga";

export const STATUS_LABEL: Record<MangaStatus, string> = {
  ongoing: "Đang ra",
  completed: "Hoàn thành",
  hiatus: "Tạm ngưng",
  cancelled: "Đã huỷ",
};

export function chapterLabel(c: { chapter: string | null; title?: string }) {
  return c.chapter === null ? c.title || "Oneshot" : `Chương ${c.chapter}`;
}

export function timeAgo(iso: string): string {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}
