import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { ResourceForm } from "@/components/admin/resource-form";
import { getResourceById, listCategories } from "@/lib/data";
import { requireAdminSession } from "@/lib/admin-session";
import { getUploadMode } from "@/lib/storage";

type EditResourcePageProps = {
  params: Promise<{
    resourceId: string;
  }>;
};

export default async function EditResourcePage({
  params,
}: EditResourcePageProps) {
  const session = await requireAdminSession();
  const { resourceId } = await params;
  const [resource, categories] = await Promise.all([
    getResourceById(resourceId),
    listCategories(),
  ]);

  if (!resource) {
    notFound();
  }

  return (
    <AdminShell userEmail={session.user.email}>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              Edit Resource
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950">
              Update {resource.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              Change the title, category, visibility, featured status, file URL,
              video link, or student-facing description without deleting the
              resource.
            </p>
          </div>

          <Link
            href="/admin/resources"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
          >
            Back to resources
          </Link>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <ResourceForm
            categories={categories}
            uploadMode={getUploadMode()}
            mode="edit"
            resource={resource}
          />
        </div>
      </div>
    </AdminShell>
  );
}
