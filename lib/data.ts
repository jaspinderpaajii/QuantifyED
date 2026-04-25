import { randomUUID } from "node:crypto";

import { readStore, writeStore } from "@/lib/demo-store";
import { createSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import type {
  Category,
  CategoryRecord,
  CreateCategoryInput,
  CreateResourceInput,
  CreateStudentInput,
  DashboardStats,
  HomepageContent,
  Resource,
  ResourceRecord,
  StudentAccount,
  StudentRecord,
  StoreSnapshot,
  UpdateHomepageInput,
  UpdateResourceInput,
} from "@/lib/types";
import { slugify } from "@/lib/utils";

type ResourceFilters = {
  category?: string;
  query?: string;
  resourceType?: "PDF" | "VIDEO";
  includeDrafts?: boolean;
};

type SupabaseCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  accent: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

type SupabaseResourceRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category_id: string;
  resource_type: "PDF" | "VIDEO";
  visibility: "PUBLIC" | "DRAFT";
  featured: boolean;
  exam: string;
  level: string;
  tags: string[] | null;
  author: string;
  file_url: string | null;
  video_url: string | null;
  page_count: number | null;
  duration: string | null;
  cover_image: string | null;
  downloads: number;
  created_at: string;
  updated_at: string;
};

type SupabaseHomepageRow = {
  hero_eyebrow: string;
  hero_title: string;
  hero_description: string;
  search_placeholder: string;
  categories_eyebrow: string;
  categories_title: string;
  categories_description: string;
  featured_eyebrow: string;
  featured_title: string;
  featured_description: string;
  value_eyebrow: string;
  value_title: string;
  value_description: string;
  flow_eyebrow: string;
  flow_title: string;
};

type SupabaseStudentRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
};

export const defaultHomepageContent: HomepageContent = {
  heroEyebrow: "QuantifyED Study Library",
  heroTitle: "Build a cleaner study plan with focused notes, PDFs, and video lessons.",
  heroDescription:
    "Find topic-wise study material, save the resources you want to revisit, and move through revision with less clutter and more confidence.",
  searchPlaceholder:
    "Search calculus, formulas, reasoning, DI, verbal, placements...",
  categoriesEyebrow: "Choose Your Track",
  categoriesTitle: "Start with the topic you need today",
  categoriesDescription:
    "Browse clean topic groups instead of digging through scattered files. Each category keeps related PDFs, videos, and practice material together.",
  featuredEyebrow: "Recommended Picks",
  featuredTitle: "Useful resources to begin with",
  featuredDescription:
    "Not sure where to start? These resources are selected for quick revision, concept refresh, and short focused study sessions.",
  valueEyebrow: "Why It Helps",
  valueTitle: "A study library that feels calm, clear, and practical",
  valueDescription:
    "The experience is designed to reduce friction: clear summaries, useful tags, saved resources, and a mix of PDFs and videos for different study styles.",
  flowEyebrow: "Study Flow",
  flowTitle: "Open, save, revise, and come back without losing your place.",
};

function mapCategoryCounts(store: StoreSnapshot) {
  return new Map(
    store.categories.map((category) => [
      category.id,
      store.resources.filter((resource) => resource.categoryId === category.id).length,
    ]),
  );
}

function decorateCategories(store: StoreSnapshot): Category[] {
  const countMap = mapCategoryCounts(store);

  return [...store.categories]
    .map((category) => ({
      ...category,
      resourceCount: countMap.get(category.id) ?? 0,
    }))
    .sort((left, right) => right.resourceCount - left.resourceCount);
}

function decorateResources(store: StoreSnapshot): Resource[] {
  const categoryMap = new Map(
    store.categories.map((category) => [category.id, category]),
  );

  return store.resources
    .map((resource) => ({
      ...resource,
      category: categoryMap.get(resource.categoryId) as CategoryRecord,
    }))
    .filter((resource) => Boolean(resource.category))
    .sort((left, right) => {
      if (left.featured !== right.featured) {
        return left.featured ? -1 : 1;
      }

      return (
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
      );
    });
}

function createUniqueSlug(base: string, existingSlugs: string[]) {
  const root = slugify(base) || "resource";

  if (!existingSlugs.includes(root)) {
    return root;
  }

  let counter = 2;
  let candidate = `${root}-${counter}`;

  while (existingSlugs.includes(candidate)) {
    counter += 1;
    candidate = `${root}-${counter}`;
  }

  return candidate;
}

function parsePageCount(value: number | null) {
  return Number.isFinite(value) ? value : null;
}

function throwSupabaseError(
  context: string,
  error: { message: string } | null,
) {
  if (error) {
    throw new Error(`${context}: ${error.message}`);
  }
}

function mapSupabaseCategory(row: SupabaseCategoryRow): CategoryRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    accent: row.accent,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSupabaseResource(row: SupabaseResourceRow): ResourceRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    categoryId: row.category_id,
    resourceType: row.resource_type,
    visibility: row.visibility,
    featured: row.featured,
    exam: row.exam,
    level: row.level,
    tags: row.tags ?? [],
    author: row.author,
    fileUrl: row.file_url,
    videoUrl: row.video_url,
    pageCount: row.page_count,
    duration: row.duration,
    coverImage: row.cover_image,
    downloads: row.downloads,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSupabaseHomepage(row: SupabaseHomepageRow): HomepageContent {
  return {
    heroEyebrow: row.hero_eyebrow,
    heroTitle: row.hero_title,
    heroDescription: row.hero_description,
    searchPlaceholder: row.search_placeholder,
    categoriesEyebrow: row.categories_eyebrow,
    categoriesTitle: row.categories_title,
    categoriesDescription: row.categories_description,
    featuredEyebrow: row.featured_eyebrow,
    featuredTitle: row.featured_title,
    featuredDescription: row.featured_description,
    valueEyebrow: row.value_eyebrow,
    valueTitle: row.value_title,
    valueDescription: row.value_description,
    flowEyebrow: row.flow_eyebrow,
    flowTitle: row.flow_title,
  };
}

function mapSupabaseStudent(row: SupabaseStudentRow): StudentRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function readContentStore() {
  if (!hasSupabaseAdminConfig()) {
    return readStore();
  }

  const supabase = createSupabaseAdmin();
  const [categoriesResult, resourcesResult, homepageResult] =
    await Promise.all([
      supabase.from("categories").select("*"),
      supabase.from("resources").select("*"),
      supabase.from("homepage").select("*").eq("id", "main").maybeSingle(),
    ]);

  throwSupabaseError("Could not load categories", categoriesResult.error);
  throwSupabaseError("Could not load resources", resourcesResult.error);
  throwSupabaseError("Could not load homepage", homepageResult.error);

  return {
    homepage: homepageResult.data
      ? mapSupabaseHomepage(homepageResult.data as SupabaseHomepageRow)
      : undefined,
    categories: ((categoriesResult.data ?? []) as SupabaseCategoryRow[]).map(
      mapSupabaseCategory,
    ),
    resources: ((resourcesResult.data ?? []) as SupabaseResourceRow[]).map(
      mapSupabaseResource,
    ),
  } satisfies StoreSnapshot;
}

function serializeHomepage(input: HomepageContent) {
  return {
    id: "main",
    hero_eyebrow: input.heroEyebrow,
    hero_title: input.heroTitle,
    hero_description: input.heroDescription,
    search_placeholder: input.searchPlaceholder,
    categories_eyebrow: input.categoriesEyebrow,
    categories_title: input.categoriesTitle,
    categories_description: input.categoriesDescription,
    featured_eyebrow: input.featuredEyebrow,
    featured_title: input.featuredTitle,
    featured_description: input.featuredDescription,
    value_eyebrow: input.valueEyebrow,
    value_title: input.valueTitle,
    value_description: input.valueDescription,
    flow_eyebrow: input.flowEyebrow,
    flow_title: input.flowTitle,
  };
}

function serializeResource(input: CreateResourceInput, slug: string) {
  return {
    slug,
    title: input.title.trim(),
    summary: input.summary.trim(),
    description: input.description.trim(),
    category_id: input.categoryId,
    resource_type: input.resourceType,
    visibility: input.visibility,
    featured: input.featured,
    exam: input.exam.trim(),
    level: input.level.trim(),
    tags: input.tags,
    author: input.author.trim(),
    file_url: input.fileUrl,
    video_url: input.videoUrl,
    page_count: parsePageCount(input.pageCount),
    duration: input.duration,
    cover_image: null,
  };
}

function toStudentAccount(student: StudentRecord): StudentAccount {
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
  };
}

export async function listCategories() {
  const store = await readContentStore();
  return decorateCategories(store);
}

export async function getHomepageContent() {
  const store = await readContentStore();
  return {
    ...defaultHomepageContent,
    ...(store.homepage ?? {}),
  };
}

export async function listResources(filters: ResourceFilters = {}) {
  const store = await readContentStore();
  let resources = decorateResources(store);

  if (!filters.includeDrafts) {
    resources = resources.filter((resource) => resource.visibility === "PUBLIC");
  }

  if (filters.category) {
    resources = resources.filter(
      (resource) => resource.category.slug === filters.category,
    );
  }

  if (filters.resourceType) {
    resources = resources.filter(
      (resource) => resource.resourceType === filters.resourceType,
    );
  }

  if (filters.query) {
    const query = filters.query.trim().toLowerCase();

    resources = resources.filter((resource) => {
      const haystack = [
        resource.title,
        resource.summary,
        resource.description,
        resource.exam,
        resource.level,
        resource.category.name,
        resource.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }

  return resources;
}

export async function getFeaturedResources(limit = 3) {
  const resources = await listResources();
  return resources.filter((resource) => resource.featured).slice(0, limit);
}

export async function getResourceBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {},
) {
  const resources = await listResources({
    includeDrafts: options.includeDrafts,
  });
  return resources.find((resource) => resource.slug === slug) ?? null;
}

export async function getResourceById(resourceId: string) {
  const resources = await listResources({ includeDrafts: true });
  return resources.find((resource) => resource.id === resourceId) ?? null;
}

export async function getStudentByEmail(email: string) {
  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdmin();
    const result = await supabase
      .from("students")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    throwSupabaseError("Could not load student", result.error);

    return result.data
      ? mapSupabaseStudent(result.data as SupabaseStudentRow)
      : null;
  }

  const store = await readStore();
  const normalizedEmail = email.trim().toLowerCase();

  return (
    (store.students ?? []).find(
      (student) => student.email.toLowerCase() === normalizedEmail,
    ) ?? null
  );
}

export async function getStudentById(studentId: string) {
  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdmin();
    const result = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId)
      .maybeSingle();

    throwSupabaseError("Could not load student", result.error);

    return result.data
      ? toStudentAccount(mapSupabaseStudent(result.data as SupabaseStudentRow))
      : null;
  }

  const store = await readStore();
  const student =
    (store.students ?? []).find((candidate) => candidate.id === studentId) ??
    null;

  return student ? toStudentAccount(student) : null;
}

export async function createStudent(input: CreateStudentInput) {
  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdmin();
    const result = await supabase
      .from("students")
      .insert({
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password_hash: input.passwordHash,
      })
      .select("*")
      .single();

    if (result.error?.code === "23505") {
      throw new Error("A student account already exists with this email.");
    }

    throwSupabaseError("Could not create student", result.error);

    return toStudentAccount(
      mapSupabaseStudent(result.data as SupabaseStudentRow),
    );
  }

  const store = await readStore();
  const normalizedEmail = input.email.trim().toLowerCase();
  const existingStudent = (store.students ?? []).some(
    (student) => student.email.toLowerCase() === normalizedEmail,
  );

  if (existingStudent) {
    throw new Error("A student account already exists with this email.");
  }

  const now = new Date().toISOString();
  const student: StudentRecord = {
    id: randomUUID(),
    name: input.name.trim(),
    email: normalizedEmail,
    passwordHash: input.passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  store.students = [student, ...(store.students ?? [])];
  await writeStore(store);

  return toStudentAccount(student);
}

export async function listSavedResourceIds(studentId: string) {
  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdmin();
    const [savedResult, resourcesResult] = await Promise.all([
      supabase
        .from("saved_resources")
        .select("resource_id")
        .eq("student_id", studentId),
      supabase
        .from("resources")
        .select("id")
        .eq("visibility", "PUBLIC"),
    ]);

    throwSupabaseError("Could not load saved resources", savedResult.error);
    throwSupabaseError("Could not load public resources", resourcesResult.error);

    const publicResourceIds = new Set(
      ((resourcesResult.data ?? []) as { id: string }[]).map(
        (resource) => resource.id,
      ),
    );

    return ((savedResult.data ?? []) as { resource_id: string }[])
      .map((savedResource) => savedResource.resource_id)
      .filter((resourceId) => publicResourceIds.has(resourceId));
  }

  const store = await readStore();
  const publicResourceIds = new Set(
    store.resources
      .filter((resource) => resource.visibility === "PUBLIC")
      .map((resource) => resource.id),
  );

  return (store.savedResources ?? [])
    .filter(
      (savedResource) =>
        savedResource.studentId === studentId &&
        publicResourceIds.has(savedResource.resourceId),
    )
    .map((savedResource) => savedResource.resourceId);
}

export async function listSavedResources(studentId: string) {
  if (hasSupabaseAdminConfig()) {
    const savedResourceIds = new Set(await listSavedResourceIds(studentId));
    const resources = await listResources();

    return resources.filter((resource) => savedResourceIds.has(resource.id));
  }

  const store = await readStore();
  const savedResourceIds = new Set(
    (store.savedResources ?? [])
      .filter((savedResource) => savedResource.studentId === studentId)
      .map((savedResource) => savedResource.resourceId),
  );

  return decorateResources(store).filter(
    (resource) =>
      resource.visibility === "PUBLIC" && savedResourceIds.has(resource.id),
  );
}

export async function isResourceSaved(studentId: string, resourceId: string) {
  const savedResourceIds = await listSavedResourceIds(studentId);
  return savedResourceIds.includes(resourceId);
}

export async function toggleSavedResource(studentId: string, resourceId: string) {
  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdmin();
    const resourceResult = await supabase
      .from("resources")
      .select("id")
      .eq("id", resourceId)
      .eq("visibility", "PUBLIC")
      .maybeSingle();

    throwSupabaseError("Could not load resource", resourceResult.error);

    if (!resourceResult.data) {
      throw new Error("That resource is not available to save.");
    }

    const savedResult = await supabase
      .from("saved_resources")
      .select("id")
      .eq("student_id", studentId)
      .eq("resource_id", resourceId)
      .maybeSingle();

    throwSupabaseError("Could not load saved resource", savedResult.error);

    if (savedResult.data) {
      const deleteResult = await supabase
        .from("saved_resources")
        .delete()
        .eq("id", (savedResult.data as { id: string }).id);

      throwSupabaseError("Could not remove saved resource", deleteResult.error);
      return false;
    }

    const insertResult = await supabase.from("saved_resources").insert({
      student_id: studentId,
      resource_id: resourceId,
    });

    throwSupabaseError("Could not save resource", insertResult.error);
    return true;
  }

  const store = await readStore();
  const resource = store.resources.find(
    (candidate) =>
      candidate.id === resourceId && candidate.visibility === "PUBLIC",
  );

  if (!resource) {
    throw new Error("That resource is not available to save.");
  }

  const savedResources = store.savedResources ?? [];
  const existingSavedResource = savedResources.find(
    (savedResource) =>
      savedResource.studentId === studentId &&
      savedResource.resourceId === resourceId,
  );

  if (existingSavedResource) {
    store.savedResources = savedResources.filter(
      (savedResource) => savedResource.id !== existingSavedResource.id,
    );
    await writeStore(store);
    return false;
  }

  store.savedResources = [
    {
      id: randomUUID(),
      studentId,
      resourceId,
      createdAt: new Date().toISOString(),
    },
    ...savedResources,
  ];
  await writeStore(store);

  return true;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const store = await readContentStore();
  const latestUpload = [...store.resources]
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )
    .at(0);

  return {
    totalResources: store.resources.length,
    totalCategories: store.categories.length,
    featuredResources: store.resources.filter((resource) => resource.featured)
      .length,
    totalDownloads: store.resources.reduce(
      (total, resource) => total + resource.downloads,
      0,
    ),
    latestUpload: latestUpload?.createdAt ?? null,
  };
}

export async function createCategory(input: CreateCategoryInput) {
  if (hasSupabaseAdminConfig()) {
    const store = await readContentStore();
    const normalizedName = input.name.trim();
    const nameExists = store.categories.some(
      (category) =>
        category.name.toLowerCase() === normalizedName.toLowerCase(),
    );

    if (nameExists) {
      throw new Error("A category with that name already exists.");
    }

    const categorySlug = createUniqueSlug(
      normalizedName,
      store.categories.map((category) => category.slug),
    );
    const supabase = createSupabaseAdmin();
    const result = await supabase
      .from("categories")
      .insert({
        name: normalizedName,
        slug: categorySlug,
        description: input.description.trim(),
        accent: input.accent,
        featured: input.featured,
      })
      .select("*")
      .single();

    throwSupabaseError("Could not create category", result.error);

    return mapSupabaseCategory(result.data as SupabaseCategoryRow);
  }

  const store = await readStore();
  const normalizedName = input.name.trim();
  const categorySlug = createUniqueSlug(
    normalizedName,
    store.categories.map((category) => category.slug),
  );

  const nameExists = store.categories.some(
    (category) => category.name.toLowerCase() === normalizedName.toLowerCase(),
  );

  if (nameExists) {
    throw new Error("A category with that name already exists.");
  }

  const now = new Date().toISOString();
  const category = {
    id: randomUUID(),
    name: normalizedName,
    slug: categorySlug,
    description: input.description.trim(),
    accent: input.accent,
    featured: input.featured,
    createdAt: now,
    updatedAt: now,
  };

  store.categories.unshift(category);
  await writeStore(store);

  return category;
}

export async function createResource(input: CreateResourceInput) {
  if (hasSupabaseAdminConfig()) {
    const store = await readContentStore();
    const category = store.categories.find(
      (candidate) => candidate.id === input.categoryId,
    );

    if (!category) {
      throw new Error("Choose a valid category before saving the resource.");
    }

    const resourceSlug = createUniqueSlug(
      input.title,
      store.resources.map((candidate) => candidate.slug),
    );
    const supabase = createSupabaseAdmin();
    const result = await supabase
      .from("resources")
      .insert(serializeResource(input, resourceSlug))
      .select("*")
      .single();

    throwSupabaseError("Could not create resource", result.error);

    return mapSupabaseResource(result.data as SupabaseResourceRow);
  }

  const store = await readStore();
  const category = store.categories.find(
    (candidate) => candidate.id === input.categoryId,
  );

  if (!category) {
    throw new Error("Choose a valid category before saving the resource.");
  }

  const now = new Date().toISOString();
  const resource = {
    id: randomUUID(),
    slug: createUniqueSlug(
      input.title,
      store.resources.map((candidate) => candidate.slug),
    ),
    title: input.title.trim(),
    summary: input.summary.trim(),
    description: input.description.trim(),
    categoryId: input.categoryId,
    resourceType: input.resourceType,
    visibility: input.visibility,
    featured: input.featured,
    exam: input.exam.trim(),
    level: input.level.trim(),
    tags: input.tags,
    author: input.author.trim(),
    fileUrl: input.fileUrl,
    videoUrl: input.videoUrl,
    pageCount: parsePageCount(input.pageCount),
    duration: input.duration,
    coverImage: null,
    downloads: 0,
    createdAt: now,
    updatedAt: now,
  };

  store.resources.unshift(resource);
  await writeStore(store);

  return resource;
}

export async function updateResource(
  resourceId: string,
  input: UpdateResourceInput,
) {
  if (hasSupabaseAdminConfig()) {
    const store = await readContentStore();
    const resource = store.resources.find(
      (candidate) => candidate.id === resourceId,
    );

    if (!resource) {
      throw new Error("That resource no longer exists.");
    }

    const category = store.categories.find(
      (candidate) => candidate.id === input.categoryId,
    );

    if (!category) {
      throw new Error("Choose a valid category before saving the resource.");
    }

    const titleChanged =
      slugify(resource.title) !== slugify(input.title.trim());
    const nextSlug = titleChanged
      ? createUniqueSlug(
          input.title,
          store.resources
            .filter((candidate) => candidate.id !== resourceId)
            .map((candidate) => candidate.slug),
        )
      : resource.slug;
    const supabase = createSupabaseAdmin();
    const result = await supabase
      .from("resources")
      .update(serializeResource(input, nextSlug))
      .eq("id", resourceId)
      .select("*")
      .single();

    throwSupabaseError("Could not update resource", result.error);

    return mapSupabaseResource(result.data as SupabaseResourceRow);
  }

  const store = await readStore();
  const resourceIndex = store.resources.findIndex(
    (resource) => resource.id === resourceId,
  );

  if (resourceIndex === -1) {
    throw new Error("That resource no longer exists.");
  }

  const category = store.categories.find(
    (candidate) => candidate.id === input.categoryId,
  );

  if (!category) {
    throw new Error("Choose a valid category before saving the resource.");
  }

  const currentResource = store.resources[resourceIndex];
  const titleChanged =
    slugify(currentResource.title) !== slugify(input.title.trim());
  const nextSlug = titleChanged
    ? createUniqueSlug(
        input.title,
        store.resources
          .filter((resource) => resource.id !== resourceId)
          .map((resource) => resource.slug),
      )
    : currentResource.slug;

  store.resources[resourceIndex] = {
    ...currentResource,
    slug: nextSlug,
    title: input.title.trim(),
    summary: input.summary.trim(),
    description: input.description.trim(),
    categoryId: input.categoryId,
    resourceType: input.resourceType,
    visibility: input.visibility,
    featured: input.featured,
    exam: input.exam.trim(),
    level: input.level.trim(),
    tags: input.tags,
    author: input.author.trim(),
    fileUrl: input.fileUrl,
    videoUrl: input.videoUrl,
    pageCount: parsePageCount(input.pageCount),
    duration: input.duration,
    updatedAt: new Date().toISOString(),
  };

  await writeStore(store);
  return store.resources[resourceIndex];
}

export async function updateHomepageContent(input: UpdateHomepageInput) {
  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdmin();
    const result = await supabase
      .from("homepage")
      .upsert(serializeHomepage(input), { onConflict: "id" })
      .select("*")
      .single();

    throwSupabaseError("Could not update homepage", result.error);

    return mapSupabaseHomepage(result.data as SupabaseHomepageRow);
  }

  const store = await readStore();
  store.homepage = input;
  await writeStore(store);

  return store.homepage;
}

export async function deleteResource(resourceId: string) {
  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdmin();
    const result = await supabase
      .from("resources")
      .delete()
      .eq("id", resourceId)
      .select("id");

    throwSupabaseError("Could not delete resource", result.error);

    if (!result.data?.length) {
      throw new Error("That resource no longer exists.");
    }

    return;
  }

  const store = await readStore();
  const nextResources = store.resources.filter(
    (resource) => resource.id !== resourceId,
  );

  if (nextResources.length === store.resources.length) {
    throw new Error("That resource no longer exists.");
  }

  store.resources = nextResources;
  await writeStore(store);
}
