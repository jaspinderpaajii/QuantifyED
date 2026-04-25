import { AdminShell } from "@/components/admin-shell";
import { ResourceForm } from "@/components/admin/resource-form";
import { requireAdminSession } from "@/lib/admin-session";
import { listCategories } from "@/lib/data";
import { getUploadMode } from "@/lib/storage";

export default async function NewResourcePage() {
  const session = await requireAdminSession();
  const categories = await listCategories();
  const uploadMode = getUploadMode();

  return (
    <AdminShell userEmail={session.user.email}>
      <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
          Upload resource
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950">
          Add a new PDF or video link
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          This form writes to the local JSON-backed store right now so you can
          work immediately. The Prisma schema and Supabase hooks are already in
          place for the move to PostgreSQL and cloud storage.
        </p>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <ResourceForm categories={categories} uploadMode={uploadMode} />
      </div>
      </div>
    </AdminShell>
  );
}
