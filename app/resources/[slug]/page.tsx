import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, PlayCircle } from "lucide-react";

import { SaveResourceButton } from "@/components/save-resource-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getResourceBySlug,
  isResourceSaved,
  listResources,
} from "@/lib/data";
import { getStudentSession } from "@/lib/student-session";
import { formatDate } from "@/lib/utils";

type ResourceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ResourceDetailPage({
  params,
}: ResourceDetailPageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const relatedResources = (await listResources({
    category: resource.category.slug,
  }))
    .filter((candidate) => candidate.slug !== resource.slug)
    .slice(0, 3);
  const studentSession = await getStudentSession();
  const savedByStudent = studentSession
    ? await isResourceSaved(studentSession.id, resource.id)
    : false;

  const primaryActionHref =
    resource.resourceType === "PDF" ? resource.fileUrl : resource.videoUrl;
  const currentPath = `/resources/${resource.slug}`;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8 lg:py-12">
        <nav className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
          <Link href="/resources" className="transition hover:text-slate-950">
            Resources
          </Link>{" "}
          /{" "}
          <span className="text-slate-700">{resource.category.name}</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section>
            <span
              className="inline-flex rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm"
              style={{ backgroundColor: resource.category.accent }}
            >
              {resource.resourceType}
            </span>

            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {resource.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {resource.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <aside className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 lg:sticky lg:top-28 lg:self-start">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              Resource Details
            </p>
            <dl className="grid gap-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Category
                </dt>
                <dd className="mt-2 text-sm font-medium text-slate-900">
                  {resource.category.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Exam / Audience
                </dt>
                <dd className="mt-2 text-sm font-medium text-slate-900">
                  {resource.exam}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Difficulty
                </dt>
                <dd className="mt-2 text-sm font-medium text-slate-900">
                  {resource.level}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Last updated
                </dt>
                <dd className="mt-2 text-sm font-medium text-slate-900">
                  {formatDate(resource.updatedAt)}
                </dd>
              </div>
              {resource.pageCount ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Page count
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-900">
                    {resource.pageCount} pages
                  </dd>
                </div>
              ) : null}
              {resource.duration ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Duration
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-900">
                    {resource.duration}
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-8 grid gap-3">
              <SaveResourceButton
                resourceId={resource.id}
                isSaved={savedByStudent}
                returnTo={currentPath}
                size="lg"
              />

              {primaryActionHref ? (
                <a
                  href={primaryActionHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800"
                >
                  {resource.resourceType === "PDF" ? (
                    <>
                      <Download className="size-4" />
                      Open PDF
                    </>
                  ) : (
                    <>
                      <PlayCircle className="size-4" />
                      Watch video
                    </>
                  )}
                </a>
              ) : null}
            </div>
          </aside>
        </div>

        {relatedResources.length > 0 ? (
          <section className="mt-16">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                  Related resources
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950">
                  Continue with the same category
                </h2>
              </div>

              <Link
                href={`/resources?category=${resource.category.slug}`}
                className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:border-slate-300 sm:inline-flex"
              >
                Browse category
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {relatedResources.map((related) => (
                <Link
                  key={related.id}
                  href={`/resources/${related.slug}`}
                  className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {related.resourceType}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-slate-950">
                    {related.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {related.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
