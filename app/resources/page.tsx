import Link from "next/link";
import {
  BookMarked,
  BookOpenCheck,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { ResourceCard } from "@/components/resource-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  listCategories,
  listResources,
  listSavedResourceIds,
} from "@/lib/data";
import { getStudentSession } from "@/lib/student-session";

type ResourcesPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    type?: "PDF" | "VIDEO";
  }>;
};

export default async function ResourcesPage({
  searchParams,
}: ResourcesPageProps) {
  const params = await searchParams;
  const [categories, resources, studentSession] = await Promise.all([
    listCategories(),
    listResources({
      query: params.q,
      category: params.category,
      resourceType: params.type,
    }),
    getStudentSession(),
  ]);
  const savedResourceIds = studentSession
    ? await listSavedResourceIds(studentSession.id)
    : [];
  const savedResourceIdSet = new Set(savedResourceIds);
  const currentSearchParams = new URLSearchParams();

  if (params.q) {
    currentSearchParams.set("q", params.q);
  }

  if (params.category) {
    currentSearchParams.set("category", params.category);
  }

  if (params.type) {
    currentSearchParams.set("type", params.type);
  }

  const currentPath = currentSearchParams.size
    ? `/resources?${currentSearchParams.toString()}`
    : "/resources";

  const activeCategory = categories.find(
    (category) => category.slug === params.category,
  );
  const activeTypeLabel =
    params.type === "PDF"
      ? "PDF resources"
      : params.type === "VIDEO"
        ? "Video lessons"
        : null;
  const hasActiveFilters = Boolean(params.q || activeCategory || activeTypeLabel);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-md bg-brand/10 px-3 py-2 text-sm font-semibold text-brand">
                <BookOpenCheck className="size-4" />
                Study Library
              </span>
              <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold text-slate-950 lg:text-5xl">
                {activeCategory
                  ? `${activeCategory.name} resources`
                  : "Find the right resource for your next study session"}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Search by topic, keyword, or format. Save useful PDFs and video
                lessons into your personal library as you browse.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {studentSession ? (
                <Link
                  href="/student/saved"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-brand"
                >
                  <BookMarked className="size-4" />
                  My Library
                </Link>
              ) : null}
              <Link
                href="/#featured"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
              >
                Featured picks
              </Link>
            </div>
          </div>

          <form className="mt-8 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[1.35fr_0.85fr_0.75fr_auto]">
            <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3">
              <Search className="size-4 text-slate-400" />
              <input
                type="search"
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Search topic, exam, concept, or tag"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>

            <select
              name="category"
              defaultValue={params.category ?? ""}
              className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              name="type"
              defaultValue={params.type ?? ""}
              className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            >
              <option value="">All types</option>
              <option value="PDF">PDF</option>
              <option value="VIDEO">Video link</option>
            </select>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-brand"
            >
              <SlidersHorizontal className="size-4" />
              Search
            </button>
          </form>

          {hasActiveFilters ? (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-slate-500">Active filters:</span>
              {params.q ? (
                <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700">
                  Search: {params.q}
                </span>
              ) : null}
              {activeCategory ? (
                <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700">
                  {activeCategory.name}
                </span>
              ) : null}
              {activeTypeLabel ? (
                <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700">
                  {activeTypeLabel}
                </span>
              ) : null}
              <Link href="/resources" className="font-semibold text-brand">
                Clear all
              </Link>
            </div>
          ) : null}
        </section>

        <nav className="mt-6 flex gap-2 overflow-x-auto pb-2 text-sm">
          <Link
            href="/resources"
            className={`shrink-0 rounded-full border px-4 py-2 font-semibold transition ${
              !params.category
                ? "border-brand bg-brand text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            All topics
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/resources?category=${category.slug}`}
              className={`shrink-0 rounded-full border px-4 py-2 font-semibold transition ${
                params.category === category.slug
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {resources.length > 0 ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isSaved={savedResourceIdSet.has(resource.id)}
                returnTo={currentPath}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="font-display text-3xl font-semibold text-slate-950">
              Nothing matched that search yet.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Try a broader keyword, switch category, or clear one filter. You
              can also use the contact page to request a missing topic.
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
