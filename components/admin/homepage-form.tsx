"use client";

import { useActionState } from "react";

import { updateHomepageAction } from "@/app/admin/actions";
import { emptyActionState } from "@/lib/action-state";
import type { HomepageContent } from "@/lib/types";

type HomepageFormProps = {
  content: HomepageContent;
};

function TextInput({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: keyof HomepageContent;
  defaultValue: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        required
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: keyof HomepageContent;
  defaultValue: string;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
      />
    </div>
  );
}

export function HomepageForm({ content }: HomepageFormProps) {
  const [state, formAction, pending] = useActionState(
    updateHomepageAction,
    emptyActionState,
  );

  return (
    <form action={formAction} className="space-y-8">
      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Hero
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-slate-950">
            First screen copy
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <TextInput
            label="Hero label"
            name="heroEyebrow"
            defaultValue={content.heroEyebrow}
          />
          <TextInput
            label="Search placeholder"
            name="searchPlaceholder"
            defaultValue={content.searchPlaceholder}
          />
        </div>
        <TextArea
          label="Hero headline"
          name="heroTitle"
          defaultValue={content.heroTitle}
          rows={3}
        />
        <TextArea
          label="Hero description"
          name="heroDescription"
          defaultValue={content.heroDescription}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Categories
          </p>
          <TextInput
            label="Section label"
            name="categoriesEyebrow"
            defaultValue={content.categoriesEyebrow}
          />
          <TextInput
            label="Section title"
            name="categoriesTitle"
            defaultValue={content.categoriesTitle}
          />
          <TextArea
            label="Section description"
            name="categoriesDescription"
            defaultValue={content.categoriesDescription}
          />
        </div>

        <div className="space-y-5 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Featured
          </p>
          <TextInput
            label="Section label"
            name="featuredEyebrow"
            defaultValue={content.featuredEyebrow}
          />
          <TextInput
            label="Section title"
            name="featuredTitle"
            defaultValue={content.featuredTitle}
          />
          <TextArea
            label="Section description"
            name="featuredDescription"
            defaultValue={content.featuredDescription}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Value Section
          </p>
          <TextInput
            label="Section label"
            name="valueEyebrow"
            defaultValue={content.valueEyebrow}
          />
          <TextInput
            label="Section title"
            name="valueTitle"
            defaultValue={content.valueTitle}
          />
          <TextArea
            label="Section description"
            name="valueDescription"
            defaultValue={content.valueDescription}
          />
        </div>

        <div className="space-y-5 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Study Flow
          </p>
          <TextInput
            label="Section label"
            name="flowEyebrow"
            defaultValue={content.flowEyebrow}
          />
          <TextInput
            label="Section title"
            name="flowTitle"
            defaultValue={content.flowTitle}
          />
        </div>
      </section>

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
        {pending ? "Updating homepage..." : "Update homepage"}
      </button>
    </form>
  );
}
