import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { HomepageForm } from "@/components/admin/homepage-form";
import { getHomepageContent } from "@/lib/data";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminHomepagePage() {
  const session = await requireAdminSession();
  const content = await getHomepageContent();

  return (
    <AdminShell userEmail={session.user.email}>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              Homepage Control
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950">
              Edit the public homepage
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              Control the homepage headline, search placeholder, and section copy
              from here. These edits update the student-facing homepage directly.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
          >
            Preview homepage
          </Link>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <HomepageForm content={content} />
        </div>
      </div>
    </AdminShell>
  );
}
