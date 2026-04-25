import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpenCheck, BookmarkPlus, GraduationCap } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StudentSignupForm } from "@/components/student-signup-form";
import { getStudentSession } from "@/lib/student-session";

type StudentSignupPageProps = {
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

export default async function StudentSignupPage({
  searchParams,
}: StudentSignupPageProps) {
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

      <main className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className="flex items-center">
          <div className="w-full rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              Create Account
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950">
              Start your student library
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Make a free student account to save the PDFs and videos you want
              to come back to. Payment access can be added later without
              rebuilding this foundation.
            </p>

            <StudentSignupForm returnTo={returnTo} />
          </div>
        </section>

        <section className="rounded-[36px] bg-[#e5f2ed] p-8 shadow-2xl shadow-slate-900/8 lg:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-900">
            <GraduationCap className="size-4" />
            Built for focused prep
          </span>

          <h2 className="mt-8 max-w-2xl font-display text-5xl font-semibold tracking-tight text-slate-950">
            From scattered links to a study shelf that remembers.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            Students can browse freely, save useful resources, and return to the
            exact material they picked earlier. Small feature, very real platform
            energy.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-emerald-900/10 bg-white/80 p-6">
              <BookmarkPlus className="size-6 text-brand" />
              <h3 className="mt-5 font-display text-2xl font-semibold text-slate-950">
                Bookmark while browsing
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Save resources from listing cards or individual detail pages.
              </p>
            </div>
            <div className="rounded-[28px] border border-emerald-900/10 bg-white/80 p-6">
              <BookOpenCheck className="size-6 text-brand" />
              <h3 className="mt-5 font-display text-2xl font-semibold text-slate-950">
                Return quickly
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Open the saved library whenever study time starts.
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-600">
            Already registered?{" "}
            <Link
              href={`/student/login?next=${encodeURIComponent(returnTo)}`}
              className="font-semibold text-brand"
            >
              Login here
            </Link>
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
