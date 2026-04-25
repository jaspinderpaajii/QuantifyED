import { redirect } from "next/navigation";
import { LockKeyhole, Sparkles } from "lucide-react";

import { auth } from "@/auth";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-screen bg-[#eef4f7] px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
      <section className="hidden rounded-[36px] bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-slate-200">
            <Sparkles className="size-4" />
            QuantifyED Admin
          </span>
          <h1 className="mt-8 max-w-xl font-display text-5xl font-semibold tracking-tight">
            Publish learning resources without touching templates.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            This dashboard is set up for PDF uploads, video links, editable
            categories, and a clean public-facing resource library.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/6 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Current MVP
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            <li>Protected admin login</li>
            <li>Editable categories</li>
            <li>PDF and video resource publishing</li>
            <li>Public resource library and detail pages</li>
          </ul>
        </div>
      </section>

      <section className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/8">
          <span className="inline-flex size-[52px] items-center justify-center rounded-3xl bg-brand text-white shadow-lg shadow-brand/30">
            <LockKeyhole className="size-6" />
          </span>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Secure entry
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950">
            Welcome back
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Use your admin credentials to open the QuantifyED content dashboard.
          </p>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
