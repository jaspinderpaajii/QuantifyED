"use server";

import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { z } from "zod";

import { signIn, signOut } from "@/auth";
import type { ActionState } from "@/lib/action-state";
import {
  createCategory,
  createResource,
  deleteResource,
  updateHomepageContent,
  updateResource,
} from "@/lib/data";
import { savePdfAsset } from "@/lib/storage";
import { ensureAbsoluteOrPath } from "@/lib/utils";

function readTextField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

const categorySchema = z.object({
  name: z.string().trim().min(3, "Use at least 3 characters for the category name."),
  description: z
    .string()
    .trim()
    .min(12, "Give the category a short description."),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Choose a valid hex color."),
  featured: z.boolean(),
});

const resourceSchema = z.object({
  title: z.string().trim().min(4, "Add a clear resource title."),
  summary: z.string().trim().min(18, "Summaries should be at least 18 characters."),
  description: z
    .string()
    .trim()
    .min(40, "Descriptions should help students understand what is inside."),
  categoryId: z.string().trim().min(1, "Choose a category."),
  resourceType: z.enum(["PDF", "VIDEO"]),
  visibility: z.enum(["PUBLIC", "DRAFT"]),
  featured: z.boolean(),
  exam: z.string().trim().min(2, "Add the target exam or audience."),
  level: z.string().trim().min(2, "Add the difficulty level."),
  tags: z.string().trim().min(2, "Add one or more tags."),
  author: z.string().trim().min(2, "Add the author or source."),
  resourceUrl: z.string().trim().optional().default(""),
  videoUrl: z.string().trim().optional().default(""),
  pageCount: z.string().trim().optional().default(""),
  duration: z.string().trim().optional().default(""),
});

const homepageSchema = z.object({
  heroEyebrow: z.string().trim().min(3, "Add a short hero label."),
  heroTitle: z.string().trim().min(12, "Add a stronger homepage headline."),
  heroDescription: z
    .string()
    .trim()
    .min(40, "Add a helpful hero description."),
  searchPlaceholder: z
    .string()
    .trim()
    .min(12, "Add a useful search placeholder."),
  categoriesEyebrow: z.string().trim().min(2, "Add a category section label."),
  categoriesTitle: z.string().trim().min(8, "Add a category section title."),
  categoriesDescription: z
    .string()
    .trim()
    .min(25, "Add a category section description."),
  featuredEyebrow: z.string().trim().min(2, "Add a featured section label."),
  featuredTitle: z.string().trim().min(8, "Add a featured section title."),
  featuredDescription: z
    .string()
    .trim()
    .min(25, "Add a featured section description."),
  valueEyebrow: z.string().trim().min(2, "Add a value section label."),
  valueTitle: z.string().trim().min(8, "Add a value section title."),
  valueDescription: z
    .string()
    .trim()
    .min(25, "Add a value section description."),
  flowEyebrow: z.string().trim().min(2, "Add a study flow label."),
  flowTitle: z.string().trim().min(8, "Add a study flow title."),
});

type ParsedResourceData = z.infer<typeof resourceSchema>;

async function resolveResourceAssetUrls(
  data: ParsedResourceData,
  formData: FormData,
): Promise<ActionState | { fileUrl: string | null; videoUrl: string | null }> {
  const pdfFileEntry = formData.get("pdfFile");
  const pdfFile =
    pdfFileEntry instanceof File && pdfFileEntry.size > 0 ? pdfFileEntry : null;
  const existingFileUrl = readTextField(formData, "existingFileUrl") || null;
  const existingVideoUrl = readTextField(formData, "existingVideoUrl") || null;

  let fileUrl = data.resourceUrl || existingFileUrl;
  const videoUrl = data.videoUrl || existingVideoUrl;

  if (data.resourceType === "PDF") {
    if (pdfFile) {
      try {
        fileUrl = await savePdfAsset(pdfFile, data.title);
      } catch (error) {
        return {
          status: "error",
          message:
            error instanceof Error ? error.message : "The PDF upload failed.",
        };
      }
    }

    if (!fileUrl) {
      return {
        status: "error",
        message:
          "For PDF resources, upload a file or provide a hosted PDF URL.",
      };
    }

    if (!ensureAbsoluteOrPath(fileUrl)) {
      return {
        status: "error",
        message: "Use a valid PDF URL or upload the PDF file directly.",
      };
    }

    return {
      fileUrl,
      videoUrl: null,
    };
  }

  if (!videoUrl || !ensureAbsoluteOrPath(videoUrl)) {
    return {
      status: "error",
      message: "Use a valid video link for video resources.",
    };
  }

  return {
    fileUrl: null,
    videoUrl,
  };
}

export async function authenticateAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await signIn("credentials", {
      email: readTextField(formData, "email"),
      password: readTextField(formData, "password"),
      redirectTo: "/admin",
    });

    return {
      status: "success",
      message: "Signed in.",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: "error",
        message: "That email or password did not match the admin account.",
      };
    }

    throw error;
  }
}

export async function createCategoryAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = categorySchema.safeParse({
    name: readTextField(formData, "name"),
    description: readTextField(formData, "description"),
    accent: readTextField(formData, "accent"),
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Could not save the category.",
    };
  }

  try {
    await createCategory(parsed.data);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Could not save the category.",
    };
  }

  revalidatePath("/");
  revalidatePath("/resources");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");

  return {
    status: "success",
    message: "Category saved. It is now available in the resource form.",
  };
}

export async function createResourceAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resourceSchema.safeParse({
    title: readTextField(formData, "title"),
    summary: readTextField(formData, "summary"),
    description: readTextField(formData, "description"),
    categoryId: readTextField(formData, "categoryId"),
    resourceType: readTextField(formData, "resourceType"),
    visibility: readTextField(formData, "visibility"),
    featured: formData.get("featured") === "on",
    exam: readTextField(formData, "exam"),
    level: readTextField(formData, "level"),
    tags: readTextField(formData, "tags"),
    author: readTextField(formData, "author"),
    resourceUrl: readTextField(formData, "resourceUrl"),
    videoUrl: readTextField(formData, "videoUrl"),
    pageCount: readTextField(formData, "pageCount"),
    duration: readTextField(formData, "duration"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Could not save the resource.",
    };
  }

  const assetResult = await resolveResourceAssetUrls(parsed.data, formData);

  if ("status" in assetResult) {
    return assetResult;
  }

  try {
    await createResource({
      title: parsed.data.title,
      summary: parsed.data.summary,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      resourceType: parsed.data.resourceType,
      visibility: parsed.data.visibility,
      featured: parsed.data.featured,
      exam: parsed.data.exam,
      level: parsed.data.level,
      tags: parsed.data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      author: parsed.data.author,
      fileUrl: assetResult.fileUrl,
      videoUrl: assetResult.videoUrl,
      pageCount: parsed.data.pageCount
        ? Number.parseInt(parsed.data.pageCount, 10)
        : null,
      duration: parsed.data.duration || null,
    });
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Could not save the resource.",
    };
  }

  revalidatePath("/");
  revalidatePath("/resources");
  revalidatePath("/admin");
  revalidatePath("/admin/resources");
  revalidatePath("/admin/resources/new");

  return {
    status: "success",
    message: "Resource saved and added to the QuantifyED library.",
  };
}

export async function updateResourceAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const resourceId = readTextField(formData, "resourceId");
  const parsed = resourceSchema.safeParse({
    title: readTextField(formData, "title"),
    summary: readTextField(formData, "summary"),
    description: readTextField(formData, "description"),
    categoryId: readTextField(formData, "categoryId"),
    resourceType: readTextField(formData, "resourceType"),
    visibility: readTextField(formData, "visibility"),
    featured: formData.get("featured") === "on",
    exam: readTextField(formData, "exam"),
    level: readTextField(formData, "level"),
    tags: readTextField(formData, "tags"),
    author: readTextField(formData, "author"),
    resourceUrl: readTextField(formData, "resourceUrl"),
    videoUrl: readTextField(formData, "videoUrl"),
    pageCount: readTextField(formData, "pageCount"),
    duration: readTextField(formData, "duration"),
  });

  if (!resourceId) {
    return {
      status: "error",
      message: "Could not find the resource to update.",
    };
  }

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Could not update the resource.",
    };
  }

  const assetResult = await resolveResourceAssetUrls(parsed.data, formData);

  if ("status" in assetResult) {
    return assetResult;
  }

  try {
    await updateResource(resourceId, {
      title: parsed.data.title,
      summary: parsed.data.summary,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      resourceType: parsed.data.resourceType,
      visibility: parsed.data.visibility,
      featured: parsed.data.featured,
      exam: parsed.data.exam,
      level: parsed.data.level,
      tags: parsed.data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      author: parsed.data.author,
      fileUrl: assetResult.fileUrl,
      videoUrl: assetResult.videoUrl,
      pageCount: parsed.data.pageCount
        ? Number.parseInt(parsed.data.pageCount, 10)
        : null,
      duration: parsed.data.duration || null,
    });
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Could not update the resource.",
    };
  }

  revalidatePath("/");
  revalidatePath("/resources");
  revalidatePath("/admin");
  revalidatePath("/admin/resources");
  revalidatePath(`/admin/resources/${resourceId}/edit`);

  return {
    status: "success",
    message: "Resource updated. The public library now uses the latest details.",
  };
}

export async function updateHomepageAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = homepageSchema.safeParse({
    heroEyebrow: readTextField(formData, "heroEyebrow"),
    heroTitle: readTextField(formData, "heroTitle"),
    heroDescription: readTextField(formData, "heroDescription"),
    searchPlaceholder: readTextField(formData, "searchPlaceholder"),
    categoriesEyebrow: readTextField(formData, "categoriesEyebrow"),
    categoriesTitle: readTextField(formData, "categoriesTitle"),
    categoriesDescription: readTextField(formData, "categoriesDescription"),
    featuredEyebrow: readTextField(formData, "featuredEyebrow"),
    featuredTitle: readTextField(formData, "featuredTitle"),
    featuredDescription: readTextField(formData, "featuredDescription"),
    valueEyebrow: readTextField(formData, "valueEyebrow"),
    valueTitle: readTextField(formData, "valueTitle"),
    valueDescription: readTextField(formData, "valueDescription"),
    flowEyebrow: readTextField(formData, "flowEyebrow"),
    flowTitle: readTextField(formData, "flowTitle"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Could not update the homepage.",
    };
  }

  await updateHomepageContent(parsed.data);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/homepage");

  return {
    status: "success",
    message: "Homepage content updated.",
  };
}

export async function deleteResourceAction(formData: FormData) {
  const resourceId = String(formData.get("resourceId") ?? "");

  if (!resourceId) {
    return;
  }

  await deleteResource(resourceId);

  revalidatePath("/");
  revalidatePath("/resources");
  revalidatePath("/admin");
  revalidatePath("/admin/resources");
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/admin/login",
  });
}
