import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import defaultStore from "@/data/content.json";
import type { StoreSnapshot } from "@/lib/types";

const storePath = path.join(process.cwd(), "data", "content.json");

export async function readStore(): Promise<StoreSnapshot> {
  try {
    const raw = await readFile(storePath, "utf8");
    return JSON.parse(raw) as StoreSnapshot;
  } catch {
    await writeStore(defaultStore as StoreSnapshot);
    return defaultStore as StoreSnapshot;
  }
}

export async function writeStore(store: StoreSnapshot) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}
