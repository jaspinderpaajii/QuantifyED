import Link from "next/link";
import { ArrowRight, Clock3, FileText, PlayCircle } from "lucide-react";

import { SaveResourceButton } from "@/components/save-resource-button";
import type { Resource } from "@/lib/types";

type ResourceCardProps = {
  resource: Resource;
  isSaved?: boolean;
  returnTo?: string;
};

export function ResourceCard({
  resource,
  isSaved = false,
  returnTo,
}: ResourceCardProps) {
  const typeIcon =
    resource.resourceType === "PDF" ? (
      <FileText className="size-4" />
    ) : (
      <PlayCircle className="size-4" />
    );

  const detailText =
    resource.resourceType === "PDF"
      ? resource.pageCount
        ? `${resource.pageCount} pages`
        : "PDF resource"
      : resource.duration ?? "Video lesson";

  return (
    <article
      className="group flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/6"
      style={{ borderTopColor: resource.category.accent, borderTopWidth: 4 }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
          style={{ backgroundColor: resource.category.accent }}
        >
          {typeIcon}
          {resource.resourceType}
        </span>
        <SaveResourceButton
          resourceId={resource.id}
          isSaved={isSaved}
          returnTo={returnTo ?? `/resources/${resource.slug}`}
        />
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <h3 className="font-display text-xl font-semibold text-slate-950">
          {resource.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {resource.summary}
        </p>

        <div className="mt-5 grid gap-2 text-sm text-slate-600">
          <div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {resource.category.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-slate-400" />
            <span>{detailText}</span>
          </div>
          <div>
            <span className="font-medium text-slate-800">{resource.exam}</span>
            <span className="text-slate-300"> / </span>
            <span>{resource.level}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5 text-sm">
          <span className="text-slate-500">{resource.downloads} opens</span>
          <Link
            href={`/resources/${resource.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 font-semibold !text-white transition group-hover:bg-brand"
          >
            Open
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
