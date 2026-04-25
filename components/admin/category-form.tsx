"use client";

import { useActionState, useEffect, useRef } from "react";

import { createCategoryAction } from "@/app/admin/actions";
import { emptyActionState } from "@/lib/action-state";

export function CategoryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    createCategoryAction,
    emptyActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Category name
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          placeholder="Quantitative Aptitude"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          placeholder="Tell students what kind of material this category covers."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
        <div>
          <label
            htmlFor="accent"
            className="text-sm font-medium text-slate-700"
          >
            Accent color
          </label>
          <input
            id="accent"
            name="accent"
            type="color"
            defaultValue="#1d4ed8"
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white p-2"
          />
        </div>

        <label className="mt-8 flex items-center gap-3 text-sm text-slate-700 sm:mt-10">
          <input
            type="checkbox"
            name="featured"
            className="size-4 rounded border-slate-300 text-brand focus:ring-brand"
          />
          Show this category in featured sections
        </label>
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
        {pending ? "Saving..." : "Save category"}
      </button>
    </form>
  );
}
