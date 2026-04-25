# QuantifyED

QuantifyED is a study-platform MVP built with the recommended stack we discussed:

- Next.js App Router
- Tailwind CSS
- Auth.js credentials-based admin login
- Prisma schema for PostgreSQL
- Supabase-ready PDF storage hooks

## What is included

- Public homepage with a curated study-platform design
- Searchable resource listing page
- Resource detail pages
- Protected admin login
- Admin overview dashboard
- Editable categories
- Resource upload form for `PDF` and `video link` entries
- Local JSON-backed persistence for immediate development use

## Why the app currently uses JSON as well

The Prisma schema and Supabase storage hooks are already included, but the app is wired to a local JSON store first so you can run it immediately without paying for infrastructure on day one.

When you are ready, you can switch to:

- Supabase Postgres for `DATABASE_URL`
- Supabase Storage for uploaded PDFs

## Local run

```bash
npm install
npm run prisma:generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin credentials

The admin login is read from `.env.local`.

Important:

- do not commit real credentials
- change `AUTH_SECRET` before production
- change the admin password before deployment

## Environment variables

Use `.env.example` as the base reference.

Required later for production:

- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

## Notes

- PDF uploads currently fall back to local project storage when Supabase is not configured.
- Local file uploads are fine for development, but for deployment you should move to Supabase Storage.
- Student login and payments are intentionally left for the next phase.
