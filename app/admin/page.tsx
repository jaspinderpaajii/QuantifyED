import Link from "next/link";
import {
  ArrowRight,
  Download,
  FolderTree,
  LayoutDashboard,
  Star,
} from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { getDashboardStats, listCategories, listResources } from "@/lib/data";
import { requireAdminSession } from "@/lib/admin-session";
import { formatDate } from "@/lib/utils";

const quickLinks = [
  {
    href: "/admin/resources/new",
    label: "Upload a new resource",
    description: "Add a PDF or video link with tags, level, and category.",
  },
  {
    href: "/admin/categories",
    label: "Manage categories",
    description: "Create new learning buckets as your content library grows.",
  },
  {
    href: "/admin/homepage",
    label: "Control homepage",
    description: "Update the student-facing headline, search text, and section copy.",
  },
  {
    href: "/resources",
    label: "Preview public library",
    description: "Check exactly how students will discover the resources.",
  },
];

export default async function AdminOverviewPage() {
  const session = await requireAdminSession();
  const [stats, recentResources, categories] = await Promise.all([
    getDashboardStats(),
    listResources({ includeDrafts: true }),
    listCategories(),
  ]);

  return (
    <AdminShell userEmail={session.user.email}>
      <div className="space-y-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Dashboard
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950">
            Content control for QuantifyED
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            This admin area is already wired for day-one publishing. The live
            resource pages update from the same content source used here.
          </p>
        </div>

        <Link
          href="/admin/resources/new"
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800"
        >
          Upload resource
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <LayoutDashboard className="size-5 text-brand" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Total resources
          </p>
          <p className="mt-3 font-display text-4xl font-semibold text-slate-950">
            {stats.totalResources}
          </p>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <FolderTree className="size-5 text-brand" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Categories
          </p>
          <p className="mt-3 font-display text-4xl font-semibold text-slate-950">
            {stats.totalCategories}
          </p>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <Star className="size-5 text-brand" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Featured items
          </p>
          <p className="mt-3 font-display text-4xl font-semibold text-slate-950">
            {stats.featuredResources}
          </p>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <Download className="size-5 text-brand" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Tracked opens
          </p>
          <p className="mt-3 font-display text-4xl font-semibold text-slate-950">
            {stats.totalDownloads}
          </p>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                Recent uploads
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950">
                Resource activity
              </h2>
            </div>
            <Link href="/admin/resources" className="text-sm font-semibold text-slate-950">
              View all
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {recentResources.slice(0, 5).map((resource) => (
              <article
                key={resource.id}
                className="flex flex-col gap-3 rounded-[24px] border border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {resource.resourceType} / {resource.category.name}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {resource.title}
                  </h3>
                </div>
                <div className="text-sm text-slate-500">
                  Uploaded {formatDate(resource.createdAt)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              Categories
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950">
              Live structure
            </h2>
            <div className="mt-6 space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: category.accent }}
                    />
                    <span className="text-sm font-medium text-slate-900">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {category.resourceCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              Quick actions
            </p>
            <div className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-[24px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5"
                >
                  <h3 className="text-base font-semibold text-slate-950">
                    {link.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
      </div>
    </AdminShell>
  );
}
