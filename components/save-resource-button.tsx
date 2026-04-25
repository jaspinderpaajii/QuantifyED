import { Bookmark, BookmarkCheck } from "lucide-react";

import { toggleSavedResourceAction } from "@/app/student/actions";

type SaveResourceButtonProps = {
  resourceId: string;
  isSaved?: boolean;
  returnTo: string;
  size?: "sm" | "lg";
};

export function SaveResourceButton({
  resourceId,
  isSaved = false,
  returnTo,
  size = "sm",
}: SaveResourceButtonProps) {
  const Icon = isSaved ? BookmarkCheck : Bookmark;
  const label = isSaved ? "Saved" : "Save";
  const sizeClass =
    size === "lg"
      ? "w-full justify-center rounded-2xl px-5 py-3 text-sm"
      : "rounded-full px-3 py-1.5 text-xs";
  const stateClass = isSaved
    ? "border-brand/30 bg-brand/10 text-brand hover:border-brand/50"
    : "border-slate-200 bg-white/90 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-950";

  return (
    <form action={toggleSavedResourceAction}>
      <input type="hidden" name="resourceId" value={resourceId} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <button
        type="submit"
        aria-pressed={isSaved}
        className={`inline-flex items-center gap-2 border font-semibold shadow-sm transition ${sizeClass} ${stateClass}`}
      >
        <Icon className={size === "lg" ? "size-4" : "size-3.5"} />
        {label}
      </button>
    </form>
  );
}
