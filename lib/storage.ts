import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

import { slugify } from "@/lib/utils";
import { getSupabaseServiceKey, getSupabaseUrl } from "@/lib/supabase-admin";

const MAX_PDF_SIZE = 20 * 1024 * 1024;

export function hasSupabaseStorageConfig() {
  return Boolean(
    getSupabaseUrl() &&
      getSupabaseServiceKey() &&
      process.env.SUPABASE_STORAGE_BUCKET,
  );
}

export function getUploadMode() {
  return hasSupabaseStorageConfig() ? "supabase" : "local";
}

export async function savePdfAsset(file: File, title: string) {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Only PDF uploads are supported right now.");
  }

  if (file.size > MAX_PDF_SIZE) {
    throw new Error("PDF uploads are limited to 20 MB.");
  }

  if (hasSupabaseStorageConfig()) {
    return uploadToSupabase(file, title);
  }

  return saveLocally(file, title);
}

async function uploadToSupabase(file: File, title: string) {
  const fileName = `${Date.now()}-${slugify(title || file.name)}.pdf`;
  const objectPath = `resources/${fileName}`;
  const supabase = createClient(
    getSupabaseUrl(),
    getSupabaseServiceKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const { error } = await supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET as string)
    .upload(objectPath, Buffer.from(await file.arrayBuffer()), {
      cacheControl: "3600",
      contentType: file.type || "application/pdf",
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET as string)
    .getPublicUrl(objectPath);

  return data.publicUrl;
}

async function saveLocally(file: File, title: string) {
  const safeName = `${Date.now()}-${slugify(title || file.name)}.pdf`;
  const outputDirectory = path.join(process.cwd(), "public", "uploads", "resources");
  const outputPath = path.join(outputDirectory, safeName);

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/resources/${safeName}`;
}
