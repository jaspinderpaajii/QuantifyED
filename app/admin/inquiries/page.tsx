import { Mail, MessageSquareText, UserRound } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { listContactInquiries } from "@/lib/contact";
import { requireAdminSession } from "@/lib/admin-session";
import { formatDate } from "@/lib/utils";

const categoryLabels = {
  RESOURCE: "Resource Request",
  GUIDANCE: "Study Guidance",
  TECHNICAL: "Technical Issue",
  OTHER: "Other",
} as const;

export default async function AdminInquiriesPage() {
  const session = await requireAdminSession();
  const inquiries = await listContactInquiries();

  return (
    <AdminShell userEmail={session.user.email}>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Contact Inquiries
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950">
            Messages from students
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Every message submitted from the public contact page appears here so
            you can review what students need next.
          </p>
        </div>

        {inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <article
                key={inquiry.id}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                      {categoryLabels[inquiry.category]}
                    </span>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <UserRound className="size-4" />
                        {inquiry.name}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Mail className="size-4" />
                        {inquiry.email}
                      </span>
                      <span>{formatDate(inquiry.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[24px] bg-slate-50 p-5">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <MessageSquareText className="size-4" />
                    Message
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {inquiry.message}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-slate-300 bg-white/70 p-12 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950">
              No inquiries yet.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              New messages from the public contact page will appear here.
            </p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
