"use client";

import { useActionState } from "react";

import { authenticateAction } from "@/app/admin/actions";
import { emptyActionState } from "@/lib/action-state";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    authenticateAction,
    emptyActionState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Admin email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          placeholder="Your admin password"
        />
      </div>

      {state.status === "error" ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Enter dashboard"}
      </button>
    </form>
  );
}
