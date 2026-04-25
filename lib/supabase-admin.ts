import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseUrl() {
  const rawUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  return rawUrl
    .trim()
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/, "");
}

export function getSupabaseServiceKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    ""
  );
}

export function hasSupabaseAdminConfig() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey());
}

export function createSupabaseAdmin() {
  if (cachedClient) {
    return cachedClient;
  }

  const supabaseUrl = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase server credentials are not configured.");
  }

  cachedClient = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
}
