import { AdminShell } from "@/components/admin-shell";
import { CategoryForm } from "@/components/admin/category-form";
import { requireAdminSession } from "@/lib/admin-session";
import { listCategories } from "@/lib/data";

export default async function CategoriesPage() {
  const session = await requireAdminSession();
  const categories = await listCategories();

  return (
    <AdminShell userEmail={session.user.email}>
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
          Categories
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950">
          Keep the content structure editable
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Your public site becomes easier to scale when categories can be added
          from the dashboard. Every new category is immediately available in the
          upload form and resource filters.
        </p>

        <div className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <CategoryForm />
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
          Current setup
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950">
          Existing categories
        </h2>

        <div className="mt-8 space-y-4">
          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-[24px] border border-slate-100 bg-slate-50 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="size-4 rounded-full"
                    style={{ backgroundColor: category.accent }}
                  />
                  <h3 className="text-lg font-semibold text-slate-950">
                    {category.name}
                  </h3>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {category.resourceCount} resources
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {category.description}
              </p>
            </article>
          ))}
        </div>
      </section>
      </div>
    </AdminShell>
  );
}
