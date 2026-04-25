import Link from "next/link";
import { Eye, Pencil, PlusCircle, Trash2 } from "lucide-react";

import { deleteResourceAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/admin-session";
import { listResources } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function AdminResourcesPage() {
  const session = await requireAdminSession();
  const resources = await listResources({ includeDrafts: true });

  return (
    <AdminShell userEmail={session.user.email}>
      <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Resources
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950">
            Manage the library
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Review uploaded resources, edit details, check visibility, and remove
            anything you no longer want on the public site.
          </p>
        </div>

        <Link
          href="/admin/resources/new"
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800"
        >
          <PlusCircle className="size-4" />
          Upload new resource
        </Link>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.5fr_0.8fr_0.7fr_0.7fr_0.8fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid">
          <span>Title</span>
          <span>Category</span>
          <span>Type</span>
          <span>Status</span>
          <span>Updated</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-slate-100">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="grid gap-4 px-6 py-5 md:grid-cols-[1.5fr_0.8fr_0.7fr_0.7fr_0.8fr_0.8fr] md:items-center"
            >
              <div>
                <p className="font-semibold text-slate-950">{resource.title}</p>
                <p className="mt-1 text-sm text-slate-500">{resource.summary}</p>
              </div>
              <div className="text-sm text-slate-600">{resource.category.name}</div>
              <div className="text-sm text-slate-600">{resource.resourceType}</div>
              <div>
                <span
                  className={
                    resource.visibility === "PUBLIC"
                      ? "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      : "inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
                  }
                >
                  {resource.visibility}
                </span>
              </div>
              <div className="text-sm text-slate-600">{formatDate(resource.updatedAt)}</div>
              <div className="flex items-center gap-3">
                {resource.visibility === "PUBLIC" ? (
                  <Link
                    href={`/resources/${resource.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Eye className="size-3.5" />
                    View
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-400">
                    <Eye className="size-3.5" />
                    Draft
                  </span>
                )}
                <Link
                  href={`/admin/resources/${resource.id}/edit`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Link>
                <form action={deleteResourceAction}>
                  <input type="hidden" name="resourceId" value={resource.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </AdminShell>
  );
}
