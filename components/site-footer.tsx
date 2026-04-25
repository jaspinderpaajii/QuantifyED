import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 text-sm text-slate-600 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <p className="font-display text-lg font-semibold text-slate-950">
            QuantifyED
          </p>
          <p className="mt-2">
            A focused study platform for topic-wise PDFs, video lessons, saved
            resources, and admin-managed learning content.
          </p>
        </div>

        <div className="flex flex-wrap gap-5">
          <Link href="/" className="transition hover:text-slate-950">
            Home
          </Link>
          <Link href="/resources" className="transition hover:text-slate-950">
            Resources
          </Link>
          <Link href="/contact" className="transition hover:text-slate-950">
            Contact
          </Link>
          <Link href="/student/saved" className="transition hover:text-slate-950">
            My Library
          </Link>
          <Link href="/admin/login" className="transition hover:text-slate-950">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
