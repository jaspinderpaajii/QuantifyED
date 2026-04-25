import Link from "next/link";
import {
  FolderTree,
  Home,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  PlusCircle,
  RectangleEllipsis,
} from "lucide-react";

import { logoutAction } from "@/app/admin/actions";

type AdminShellProps = {
  userEmail: string;
  children: React.ReactNode;
};

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/resources", label: "Resources", icon: RectangleEllipsis },
  { href: "/admin/resources/new", label: "Upload Resource", icon: PlusCircle },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessagesSquare },
];

export function AdminShell({ userEmail, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#eef4f7] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20">
          <div className="rounded-[22px] border border-white/10 bg-white/6 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
              QuantifyED
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              Admin CMS
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Manage categories, upload PDFs, and keep the public library fresh.
            </p>
          </div>

          <div className="mt-8 rounded-[22px] border border-white/10 bg-white/6 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Signed in as
            </p>
            <p className="mt-2 break-all text-sm font-medium text-white">
              {userEmail}
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form action={logoutAction} className="mt-8">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold !text-white transition hover:bg-white/10"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </form>
        </aside>

        <main className="rounded-[32px] bg-white p-6 shadow-xl shadow-slate-900/5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
