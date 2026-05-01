/**
 * Persistence layer — Vercel Blob with in-memory fallback.
 *
 * When BLOB_READ_WRITE_TOKEN is set, data persists as JSON files in Vercel Blob
 * and survives cold starts. When unset, falls back to in-memory Map (dev/demo).
 */

import { put, list } from "@vercel/blob";
import { type ScoreResult } from "./scoring";

export type GateData = {
  answers: Record<string, string | string[]>;
  email: string;
  firstName: string;
  company: string;
  role: string;
  category: string;
};

// --- In-memory fallback ---
const memResults = new Map<string, ScoreResult>();
const memGates = new Map<string, GateData>();

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// --- Gate operations ---

export async function saveGate(id: string, data: GateData): Promise<void> {
  if (hasBlobToken()) {
    await put(`gates/gate-${id}.json`, JSON.stringify(data), {
      access: "public",
      addRandomSuffix: false,
    });
  }
  memGates.set(id, data);
}

export async function getGate(id: string): Promise<GateData | undefined> {
  // Try memory first (same invocation)
  const mem = memGates.get(id);
  if (mem) return mem;

  if (!hasBlobToken()) return undefined;

  try {
    // List blobs to find the gate file
    const { blobs } = await list({ prefix: `gates/gate-${id}.json` });
    if (blobs.length === 0) return undefined;

    const res = await fetch(blobs[0].url);
    if (!res.ok) return undefined;

    const data = (await res.json()) as GateData;
    memGates.set(id, data); // cache in memory
    return data;
  } catch (err) {
    console.error("[store] Failed to read gate from blob:", err);
    return undefined;
  }
}

// --- Result operations ---

export async function saveResult(result: ScoreResult): Promise<void> {
  if (hasBlobToken()) {
    await put(`results/result-${result.id}.json`, JSON.stringify(result), {
      access: "public",
      addRandomSuffix: false,
    });
  }
  memResults.set(result.id, result);
}

export async function getResult(
  id: string,
): Promise<ScoreResult | undefined> {
  // Try memory first
  const mem = memResults.get(id);
  if (mem) return mem;

  if (!hasBlobToken()) return undefined;

  try {
    const { blobs } = await list({ prefix: `results/result-${id}.json` });
    if (blobs.length === 0) return undefined;

    const res = await fetch(blobs[0].url);
    if (!res.ok) return undefined;

    const data = (await res.json()) as ScoreResult;
    memResults.set(data.id, data); // cache in memory
    return data;
  } catch (err) {
    console.error("[store] Failed to read result from blob:", err);
    return undefined;
  }
}
