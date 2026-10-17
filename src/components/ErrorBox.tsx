import Link from "next/link";

export default function ErrorBox({ message, backHref = "/", backLabel = "Về trang chủ" }: {
  message: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="container-main py-10">
      <div className="card p-10 text-center">
        <svg className="w-12 h-12 text-txt-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p className="text-txt-secondary">{message}</p>
        <Link href={backHref} className="btn-primary mt-4">{backLabel}</Link>
      </div>
    </div>
  );
}
