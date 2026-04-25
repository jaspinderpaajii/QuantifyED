"use client";

import { useActionState, useEffect, useRef } from "react";

import { submitContactAction } from "@/app/contact/actions";
import { emptyActionState } from "@/lib/action-state";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    submitContactAction,
    emptyActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Your name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="text-sm font-medium text-slate-700">
          What do you need help with?
        </label>
        <select
          id="category"
          name="category"
          defaultValue="RESOURCE"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
        >
          <option value="RESOURCE">Finding a resource</option>
          <option value="GUIDANCE">Study guidance</option>
          <option value="TECHNICAL">A link or file issue</option>
          <option value="OTHER">Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          placeholder="Example: I need a short revision PDF for trigonometry basics, suitable for Class 11."
        />
      </div>

      {state.status !== "idle" ? (
        <p
          className={
            state.status === "success"
              ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              : "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          }
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
