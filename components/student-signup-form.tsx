"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signupStudentAction } from "@/app/student/actions";
import { emptyActionState } from "@/lib/action-state";

type StudentSignupFormProps = {
  returnTo: string;
};

export function StudentSignupForm({ returnTo }: StudentSignupFormProps) {
  const [state, formAction, pending] = useActionState(
    signupStudentAction,
    emptyActionState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="returnTo" value={returnTo} />

      <div>
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          placeholder="Your name"
        />
      </div>

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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            placeholder="At least 6 characters"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            placeholder="Repeat password"
          />
        </div>
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
        {pending ? "Creating account..." : "Create student account"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href={`/student/login?next=${encodeURIComponent(returnTo)}`}
          className="font-semibold text-brand"
        >
          Login instead
        </Link>
      </p>
    </form>
  );
}
