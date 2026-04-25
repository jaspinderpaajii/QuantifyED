"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginStudentAction } from "@/app/student/actions";
import { emptyActionState } from "@/lib/action-state";

type StudentLoginFormProps = {
  returnTo: string;
};

export function StudentLoginForm({ returnTo }: StudentLoginFormProps) {
  const [state, formAction, pending] = useActionState(
    loginStudentAction,
    emptyActionState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="returnTo" value={returnTo} />

      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Student email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          placeholder="student@example.com"
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
          placeholder="Your student password"
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
        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold !text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Opening your library..." : "Login as student"}
      </button>

      <p className="text-center text-sm text-slate-600">
        New to QuantifyED?{" "}
        <Link
          href={`/student/signup?next=${encodeURIComponent(returnTo)}`}
          className="font-semibold text-brand"
        >
          Create a student account
        </Link>
      </p>
    </form>
  );
}
