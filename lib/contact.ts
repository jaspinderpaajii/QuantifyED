import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { createSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabase-admin";

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  category: "RESOURCE" | "GUIDANCE" | "TECHNICAL" | "OTHER";
  message: string;
  createdAt: string;
};

type SupabaseInquiryRow = {
  id: string;
  name: string;
  email: string;
  category: ContactInquiry["category"];
  message: string;
  created_at: string;
};

const inquiriesPath = path.join(process.cwd(), "data", "contact-inquiries.json");

async function readInquiryStore() {
  try {
    const raw = await readFile(inquiriesPath, "utf8");
    return JSON.parse(raw) as ContactInquiry[];
  } catch {
    await writeInquiryStore([]);
    return [];
  }
}

async function writeInquiryStore(inquiries: ContactInquiry[]) {
  await mkdir(path.dirname(inquiriesPath), { recursive: true });
  await writeFile(inquiriesPath, `${JSON.stringify(inquiries, null, 2)}\n`, "utf8");
}

function throwSupabaseError(
  context: string,
  error: { message: string } | null,
) {
  if (error) {
    throw new Error(`${context}: ${error.message}`);
  }
}

function mapSupabaseInquiry(row: SupabaseInquiryRow): ContactInquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    category: row.category,
    message: row.message,
    createdAt: row.created_at,
  };
}

export async function listContactInquiries() {
  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdmin();
    const result = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    throwSupabaseError("Could not load inquiries", result.error);

    return ((result.data ?? []) as SupabaseInquiryRow[]).map(
      mapSupabaseInquiry,
    );
  }

  const inquiries = await readInquiryStore();

  return [...inquiries].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export async function createContactInquiry(input: {
  name: string;
  email: string;
  category: ContactInquiry["category"];
  message: string;
}) {
  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdmin();
    const result = await supabase
      .from("inquiries")
      .insert({
        name: input.name.trim(),
        email: input.email.trim(),
        category: input.category,
        message: input.message.trim(),
      })
      .select("*")
      .single();

    throwSupabaseError("Could not create inquiry", result.error);

    return mapSupabaseInquiry(result.data as SupabaseInquiryRow);
  }

  const inquiries = await readInquiryStore();
  const inquiry: ContactInquiry = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim(),
    category: input.category,
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
  };

  inquiries.unshift(inquiry);
  await writeInquiryStore(inquiries);

  return inquiry;
}
