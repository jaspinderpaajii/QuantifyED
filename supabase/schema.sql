create extension if not exists pgcrypto;
create extension if not exists citext;

do $$
begin
  if not exists (
    select 1 from pg_type
    where typname = 'resource_type'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.resource_type as enum ('PDF', 'VIDEO');
  end if;

  if not exists (
    select 1 from pg_type
    where typname = 'visibility_status'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.visibility_status as enum ('PUBLIC', 'DRAFT');
  end if;

  if not exists (
    select 1 from pg_type
    where typname = 'inquiry_category'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.inquiry_category as enum (
      'RESOURCE',
      'GUIDANCE',
      'TECHNICAL',
      'OTHER'
    );
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.homepage (
  id text primary key default 'main',
  hero_eyebrow text not null,
  hero_title text not null,
  hero_description text not null,
  search_placeholder text not null,
  categories_eyebrow text not null,
  categories_title text not null,
  categories_description text not null,
  featured_eyebrow text not null,
  featured_title text not null,
  featured_description text not null,
  value_eyebrow text not null,
  value_title text not null,
  value_description text not null,
  flow_eyebrow text not null,
  flow_title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint homepage_singleton check (id = 'main')
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  accent text not null default '#116149',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_accent_hex check (accent ~ '^#[0-9a-fA-F]{6}$')
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text not null,
  category_id uuid not null references public.categories(id) on update cascade on delete restrict,
  resource_type public.resource_type not null default 'PDF',
  visibility public.visibility_status not null default 'PUBLIC',
  featured boolean not null default false,
  exam text not null,
  level text not null,
  tags text[] not null default '{}',
  author text not null default 'QuantifyED Team',
  file_url text,
  video_url text,
  page_count integer,
  duration text,
  cover_image text,
  downloads integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resources_downloads_non_negative check (downloads >= 0),
  constraint resources_page_count_non_negative check (
    page_count is null or page_count >= 0
  ),
  constraint resources_asset_matches_type check (
    (
      resource_type = 'PDF'
      and nullif(file_url, '') is not null
      and video_url is null
    )
    or
    (
      resource_type = 'VIDEO'
      and nullif(video_url, '') is not null
      and file_url is null
    )
  )
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email citext not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_resources (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint saved_resources_unique_student_resource unique (student_id, resource_id)
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email citext not null,
  category public.inquiry_category not null,
  message text not null,
  status text not null default 'NEW',
  created_at timestamptz not null default now()
);

create index if not exists categories_slug_idx on public.categories(slug);
create index if not exists resources_slug_idx on public.resources(slug);
create index if not exists resources_category_id_idx on public.resources(category_id);
create index if not exists resources_visibility_idx on public.resources(visibility);
create index if not exists resources_featured_idx on public.resources(featured);
create index if not exists students_email_idx on public.students(email);
create index if not exists saved_resources_student_id_idx on public.saved_resources(student_id);
create index if not exists saved_resources_resource_id_idx on public.saved_resources(resource_id);
create index if not exists inquiries_created_at_idx on public.inquiries(created_at desc);

drop trigger if exists set_homepage_updated_at on public.homepage;
create trigger set_homepage_updated_at
before update on public.homepage
for each row execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_resources_updated_at on public.resources;
create trigger set_resources_updated_at
before update on public.resources
for each row execute function public.set_updated_at();

drop trigger if exists set_students_updated_at on public.students;
create trigger set_students_updated_at
before update on public.students
for each row execute function public.set_updated_at();

alter table public.homepage enable row level security;
alter table public.categories enable row level security;
alter table public.resources enable row level security;
alter table public.students enable row level security;
alter table public.saved_resources enable row level security;
alter table public.inquiries enable row level security;

insert into public.homepage (
  id,
  hero_eyebrow,
  hero_title,
  hero_description,
  search_placeholder,
  categories_eyebrow,
  categories_title,
  categories_description,
  featured_eyebrow,
  featured_title,
  featured_description,
  value_eyebrow,
  value_title,
  value_description,
  flow_eyebrow,
  flow_title
) values (
  'main',
  'QuantifyED Study Library',
  'Build a cleaner study plan with focused notes, PDFs, and video lessons.',
  'Find topic-wise study material, save the resources you want to revisit, and move through revision with less clutter and more confidence.',
  'Search calculus, formulas, reasoning, DI, verbal, placements...',
  'Choose Your Track',
  'Start with the topic you need today',
  'Browse clean topic groups instead of digging through scattered files. Each category keeps related PDFs, videos, and practice material together.',
  'Recommended Picks',
  'Useful resources to begin with',
  'Not sure where to start? These resources are selected for quick revision, concept refresh, and short focused study sessions.',
  'Why It Helps',
  'A study library that feels calm, clear, and practical',
  'The experience is designed to reduce friction: clear summaries, useful tags, saved resources, and a mix of PDFs and videos for different study styles.',
  'Study Flow',
  'Open, save, revise, and come back without losing your place.'
) on conflict (id) do nothing;
