import Link from "next/link";
import {
  ArrowUpRight,
  BookMarked,
  BookOpenText,
  LayoutDashboard,
} from "lucide-react";

import { auth } from "@/auth";
import { getStudentSession } from "@/lib/student-session";

const links = [
  { href: "/", label: "Home" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const [session, studentSession] = await Promise.all([
    auth(),
    getStudentSession(),
  ]);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-slate-950">
          <span className="flex size-10 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
            <BookOpenText className="size-5" />
          </span>
          <span>
            <span className="font-display text-lg font-semibold">
              QuantifyED
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Study Compass
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
          ) : studentSession ? (
            <Link
              href="/student/saved"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold !text-white shadow-sm transition hover:bg-brand"
            >
              <BookMarked className="size-4" />
              My Library
            </Link>
          ) : (
            <>
              <Link
                href="/student/login"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold !text-white shadow-sm transition hover:bg-brand"
              >
                <span className="hidden sm:inline">Student Login</span>
                <span className="sm:hidden">Login</span>
              </Link>
              <Link
                href="/admin/login"
                className="hidden items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 sm:inline-flex"
              >
                Admin
                <ArrowUpRight className="size-4" />
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-5 pb-3 text-sm font-semibold text-slate-600 md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300 hover:text-slate-950"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/student/saved"
          className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300 hover:text-slate-950"
        >
          My Library
        </Link>
      </nav>
    </header>
  );
}
