"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { createResourceAction, updateResourceAction } from "@/app/admin/actions";
import { emptyActionState } from "@/lib/action-state";
import type { Category, Resource } from "@/lib/types";

type ResourceFormProps = {
  categories: Category[];
  uploadMode: "local" | "supabase";
  mode?: "create" | "edit";
  resource?: Resource;
};

export function ResourceForm({
  categories,
  uploadMode,
  mode = "create",
  resource,
}: ResourceFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = mode === "edit";
  const initialResourceType = resource?.resourceType ?? "PDF";
  const [resourceType, setResourceType] = useState<"PDF" | "VIDEO">(
    initialResourceType,
  );
  const [state, formAction, pending] = useActionState(
    isEditing ? updateResourceAction : createResourceAction,
    emptyActionState,
  );

  useEffect(() => {
    if (state.status === "success" && !isEditing) {
      formRef.current?.reset();
    }
  }, [isEditing, state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-6"
      onReset={() => setResourceType(initialResourceType)}
    >
      {resource ? (
        <>
          <input type="hidden" name="resourceId" value={resource.id} />
          <input
            type="hidden"
            name="existingFileUrl"
            value={resource.fileUrl ?? ""}
          />
          <input
            type="hidden"
            name="existingVideoUrl"
            value={resource.videoUrl ?? ""}
          />
        </>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={resource?.title ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            placeholder="Quantitative Aptitude Formula Handbook"
          />
        </div>

        <div>
          <label htmlFor="author" className="text-sm font-medium text-slate-700">
            Author / Source
          </label>
          <input
            id="author"
            name="author"
            required
            defaultValue={resource?.author ?? "QuantifyED Team"}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            placeholder="QuantifyED Team"
          />
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="text-sm font-medium text-slate-700">
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={2}
          required
          defaultValue={resource?.summary ?? ""}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          placeholder="A quick overview students will see on cards and listings."
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-700"
        >
          Full description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          defaultValue={resource?.description ?? ""}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          placeholder="Explain what is inside, who it is for, and how students should use it."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label
            htmlFor="categoryId"
            className="text-sm font-medium text-slate-700"
          >
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            defaultValue={resource?.categoryId ?? ""}
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="resourceType"
            className="text-sm font-medium text-slate-700"
          >
            Resource type
          </label>
          <select
            id="resourceType"
            name="resourceType"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            value={resourceType}
            onChange={(event) =>
              setResourceType(event.target.value as "PDF" | "VIDEO")
            }
          >
            <option value="PDF">PDF</option>
            <option value="VIDEO">Video link</option>
          </select>
        </div>

        <div>
          <label htmlFor="exam" className="text-sm font-medium text-slate-700">
            Exam / audience
          </label>
          <input
            id="exam"
            name="exam"
            required
            defaultValue={resource?.exam ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            placeholder="CAT / Placements"
          />
        </div>

        <div>
          <label htmlFor="level" className="text-sm font-medium text-slate-700">
            Difficulty
          </label>
          <input
            id="level"
            name="level"
            required
            defaultValue={resource?.level ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            placeholder="Beginner to Intermediate"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr]">
        <div>
          <label htmlFor="tags" className="text-sm font-medium text-slate-700">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            required
            defaultValue={resource?.tags.join(", ") ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            placeholder="Revision, Speed Math, PDF"
          />
        </div>

        <div>
          <label
            htmlFor="visibility"
            className="text-sm font-medium text-slate-700"
          >
            Visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            defaultValue={resource?.visibility ?? "PUBLIC"}
          >
            <option value="PUBLIC">Public</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        <label className="mt-8 flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={resource?.featured ?? false}
            className="size-4 rounded border-slate-300 text-brand focus:ring-brand"
          />
          Feature this resource
        </label>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-slate-950">
            {resourceType === "PDF" ? "PDF upload details" : "Video link details"}
          </h3>
          <p className="text-sm leading-6 text-slate-600">
            {resourceType === "PDF"
              ? uploadMode === "supabase"
                ? "PDF files are currently configured to upload into Supabase Storage."
                : "PDF files are currently stored locally for development. Once Supabase credentials are added, this can switch to cloud storage."
              : "Paste the public video link students should open from the resource page."}
          </p>
        </div>

        {resourceType === "PDF" ? (
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            <div>
              <label
                htmlFor="pdfFile"
                className="text-sm font-medium text-slate-700"
              >
                Upload PDF
              </label>
              <input
                id="pdfFile"
                name="pdfFile"
                type="file"
                accept="application/pdf"
                className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600"
              />
            </div>

            <div>
              <label
                htmlFor="resourceUrl"
                className="text-sm font-medium text-slate-700"
              >
                Or use a hosted PDF URL
              </label>
              <input
                id="resourceUrl"
                name="resourceUrl"
                defaultValue={resource?.fileUrl ?? ""}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                placeholder="https://..."
              />
            </div>

            <div>
              <label
                htmlFor="pageCount"
                className="text-sm font-medium text-slate-700"
              >
                Page count
              </label>
              <input
                id="pageCount"
                name="pageCount"
                inputMode="numeric"
                defaultValue={resource?.pageCount?.toString() ?? ""}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                placeholder="48"
              />
            </div>
          </div>
        ) : (
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            <div>
              <label
                htmlFor="videoUrl"
                className="text-sm font-medium text-slate-700"
              >
                Video URL
              </label>
              <input
                id="videoUrl"
                name="videoUrl"
                defaultValue={resource?.videoUrl ?? ""}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                placeholder="https://youtube.com/..."
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="text-sm font-medium text-slate-700"
              >
                Duration
              </label>
              <input
                id="duration"
                name="duration"
                defaultValue={resource?.duration ?? ""}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                placeholder="42 min"
              />
            </div>
          </div>
        )}
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
        {pending
          ? isEditing
            ? "Updating resource..."
            : "Saving resource..."
          : isEditing
            ? "Update resource"
            : "Save resource"}
      </button>
    </form>
  );
}
