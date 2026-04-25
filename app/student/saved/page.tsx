import Link from "next/link";
import { ArrowRight, BookmarkCheck, LogOut } from "lucide-react";

import { logoutStudentAction } from "@/app/student/actions";
import { ResourceCard } from "@/components/resource-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listSavedResources } from "@/lib/data";
import { requireStudentSession } from "@/lib/student-session";

export default async function StudentSavedResourcesPage() {
  const student = await requireStudentSession();
  const savedResources = await listSavedResources(student.id);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
        <section className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">
                <BookmarkCheck className="size-4" />
                My Library
              </span>
              <h1 className="mt-5 font-display text-5xl font-semibold tracking-tight text-slate-950">
                Your saved study shelf
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Welcome back, {student.name}. Keep useful PDFs and video lessons
                here so revision starts quickly the next time you return.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-brand"
              >
                Browse resources
                <ArrowRight className="size-4" />
              </Link>
              <form action={logoutStudentAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </section>

        {savedResources.length > 0 ? (
          <section className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {savedResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isSaved
                returnTo="/student/saved"
              />
            ))}
          </section>
        ) : (
          <section className="mt-8 rounded-[36px] border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              Nothing saved yet
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950">
              Build your study shelf as you browse.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Open the resource library and use the Save button on PDFs or video
              lessons you want to revisit. They will appear here automatically.
            </p>
            <Link
              href="/resources"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-brand"
            >
              Browse resources
              <ArrowRight className="size-4" />
            </Link>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
