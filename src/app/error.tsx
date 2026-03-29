"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-main pt-20 pb-12">
      <div className="card p-10 text-center">
        <svg
          className="w-12 h-12 text-txt-muted mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-txt-secondary">Đã xảy ra lỗi khi tải trang.</p>
        <button onClick={reset} className="btn-primary mt-4">
          Thử lại
        </button>
      </div>
    </div>
  );
}
