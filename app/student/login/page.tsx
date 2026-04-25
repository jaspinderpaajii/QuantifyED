import Link from "next/link";
import { redirect } from "next/navigation";
import { BookMarked, LockKeyhole, Sparkles } from "lucide-react";

import { StudentLoginForm } from "@/components/student-login-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getStudentSession } from "@/lib/student-session";

type StudentLoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

function normalizeNext(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/student/saved";
  }

  if (value.startsWith("/admin")) {
    return "/student/saved";
  }

  return value;
}

export default async function StudentLoginPage({
  searchParams,
}: StudentLoginPageProps) {
  const [params, student] = await Promise.all([
    searchParams,
    getStudentSession(),
  ]);
  const returnTo = normalizeNext(params.next);

  if (student) {
    redirect(returnTo);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="rounded-[36px] bg-slate-950 p-8 !text-white shadow-2xl shadow-slate-900/16 lg:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-slate-200">
            <Sparkles className="size-4" />
            Student space
          </span>

          <h1 className="mt-8 max-w-2xl font-display text-5xl font-semibold tracking-tight">
            Keep your best study resources in one place.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Login to save PDFs and video lessons while you browse. Your saved
            library becomes a focused study shelf you can return to anytime.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-6">
              <BookMarked className="size-6 text-emerald-200" />
              <h2 className="mt-5 font-display text-2xl font-semibold">
                Save resources
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Bookmark useful material directly from cards and resource pages.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-6">
              <LockKeyhole className="size-6 text-emerald-200" />
              <h2 className="mt-5 font-display text-2xl font-semibold">
                Private library
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Your saved list is connected to your student account, not the
                public library.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              Student Login
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950">
              Welcome back
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Login to open your saved library. Admin access stays separate at{" "}
              <Link href="/admin/login" className="font-semibold text-brand">
                admin login
              </Link>
              .
            </p>

            <StudentLoginForm returnTo={returnTo} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
