import Link from "next/link";
import {
  ArrowRight,
  BookCopy,
  ChartColumnIncreasing,
  FileText,
  GraduationCap,
  PlayCircle,
  Search,
  ShieldCheck,
} from "lucide-react";

import { ResourceCard } from "@/components/resource-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getDashboardStats,
  getFeaturedResources,
  getHomepageContent,
  listCategories,
  listSavedResourceIds,
} from "@/lib/data";
import { getStudentSession } from "@/lib/student-session";

const valuePoints = [
  {
    icon: FileText,
    title: "Find material faster",
    description:
      "Search by topic, format, exam, and level so you spend less time hunting and more time studying.",
  },
  {
    icon: PlayCircle,
    title: "Use the right format",
    description:
      "Open PDFs for quiet revision and video lessons when you need a guided explanation.",
  },
  {
    icon: ShieldCheck,
    title: "Keep your picks saved",
    description:
      "Login as a student and save useful resources into a personal study shelf.",
  },
];

export default async function HomePage() {
  const [categories, featuredResources, stats, homepage, studentSession] =
    await Promise.all([
      listCategories(),
      getFeaturedResources(3),
      getDashboardStats(),
      getHomepageContent(),
      getStudentSession(),
    ]);
  const savedResourceIds = studentSession
    ? await listSavedResourceIds(studentSession.id)
    : [];
  const savedResourceIdSet = new Set(savedResourceIds);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="border-b border-slate-200 bg-slate-950 !text-white">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-8 lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-slate-100">
                <GraduationCap className="size-4" />
                {homepage.heroEyebrow}
              </span>

              <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
                {homepage.heroTitle}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {homepage.heroDescription}
              </p>

              <form
                action="/resources"
                className="mt-8 grid gap-3 rounded-lg border border-white/15 bg-white p-3 text-slate-950 shadow-2xl shadow-slate-950/30 sm:grid-cols-[1fr_auto]"
              >
                <label className="flex items-center gap-3 rounded-md bg-slate-50 px-4 py-3">
                  <Search className="size-5 text-slate-400" />
                  <input
                    name="q"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    placeholder={homepage.searchPlaceholder}
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold !text-white transition hover:bg-brand-strong"
                >
                  Search resources
                  <ArrowRight className="size-4" />
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                <span>Popular searches:</span>
                <Link href="/resources?q=formula" className="font-semibold text-white">
                  Formula sheets
                </Link>
                <Link href="/resources?type=PDF" className="font-semibold text-white">
                  PDFs
                </Link>
                <Link
                  href="/resources?type=VIDEO"
                  className="font-semibold text-white"
                >
                  Video lessons
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-2xl shadow-slate-950/20">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-5 text-slate-950">
                  <p className="text-sm font-semibold text-slate-500">
                    Study resources
                  </p>
                  <p className="mt-3 font-display text-4xl font-semibold text-slate-950">
                    {stats.totalResources}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    PDFs and videos ready for revision.
                  </p>
                </div>

                <div className="rounded-lg bg-accent p-5 !text-white">
                  <p className="text-sm font-semibold text-blue-100">
                    Student picks
                  </p>
                  <p className="mt-3 font-display text-4xl font-semibold">
                    {stats.featuredResources}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-blue-50">
                    Strong starting points.
                  </p>
                </div>

                <div className="rounded-lg bg-brand p-5 !text-white">
                  <p className="text-sm font-semibold text-emerald-100">
                    Topics covered
                  </p>
                  <p className="mt-3 font-display text-4xl font-semibold">
                    {stats.totalCategories}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-50">
                    Organized by study focus.
                  </p>
                </div>

                <div className="rounded-lg bg-white p-5 text-slate-950">
                  <p className="text-sm font-semibold text-slate-500">
                    Total opens
                  </p>
                  <p className="mt-3 font-display text-4xl font-semibold text-slate-950">
                    {stats.totalDownloads}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Saved, opened, and revisited.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 w-full max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow={homepage.categoriesEyebrow}
            title={homepage.categoriesTitle}
            description={homepage.categoriesDescription}
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <article
                key={category.id}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div
                  className="flex size-11 items-center justify-center rounded-lg text-white shadow-sm"
                  style={{ backgroundColor: category.accent }}
                >
                  <BookCopy className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-slate-950">
                  {category.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                  <span className="font-medium text-slate-500">
                    {category.resourceCount} resources
                  </span>
                  <Link
                    href={`/resources?category=${category.slug}`}
                    className="font-semibold text-slate-950"
                  >
                    View topic
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="featured"
          className="mx-auto mt-16 w-full max-w-7xl px-5 lg:px-8"
        >
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow={homepage.featuredEyebrow}
              title={homepage.featuredTitle}
              description={homepage.featuredDescription}
            />

            <Link
              href="/resources"
              className="hidden items-center gap-2 text-sm font-semibold text-slate-950 sm:inline-flex"
            >
              Open full library
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {featuredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isSaved={savedResourceIdSet.has(resource.id)}
                returnTo="/"
              />
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 w-full max-w-7xl px-5 lg:px-8">
          <div className="rounded-lg bg-slate-950 px-5 py-8 !text-white lg:px-8 lg:py-10">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
              <SectionHeading
                eyebrow={homepage.valueEyebrow}
                title={homepage.valueTitle}
                description={homepage.valueDescription}
                invert
              />

              <div className="grid max-w-3xl gap-4 md:grid-cols-3">
                {valuePoints.map((point) => {
                  const Icon = point.icon;

                  return (
                    <article
                      key={point.title}
                      className="rounded-lg border border-white/10 bg-white/6 p-5"
                    >
                      <span className="inline-flex size-10 items-center justify-center rounded-lg bg-white/10">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="mt-5 font-display text-xl font-semibold">
                        {point.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {point.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 w-full max-w-7xl px-5 pb-16 lg:px-8">
          <div className="grid gap-6 border-y border-slate-200 bg-white/70 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-0">
            <div>
              <p className="text-sm font-semibold text-brand">
                {homepage.flowEyebrow}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">
                {homepage.flowTitle}
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-lg bg-slate-50 p-5">
                <ChartColumnIncreasing className="size-5 text-brand" />
                <h3 className="mt-4 font-semibold text-slate-950">Quick revision</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Refresh concepts before practice, class, or a test.
                </p>
              </article>
              <article className="rounded-lg bg-slate-50 p-5">
                <FileText className="size-5 text-brand" />
                <h3 className="mt-4 font-semibold text-slate-950">Topic-based learning</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Move across topics with clear categories and less confusion.
                </p>
              </article>
              <article className="rounded-lg bg-slate-50 p-5">
                <BookCopy className="size-5 text-brand" />
                <h3 className="mt-4 font-semibold text-slate-950">Multiple formats</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use PDFs for quick revision and videos for guided explanation.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
