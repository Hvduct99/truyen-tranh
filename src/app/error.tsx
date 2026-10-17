"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-main py-10">
      <div className="card p-10 text-center">
        <p className="text-txt-secondary">Đã xảy ra lỗi khi tải trang.</p>
        <button onClick={reset} className="btn-primary mt-4">Thử lại</button>
      </div>
    </div>
  );
}
