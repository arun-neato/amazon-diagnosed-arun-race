/**
 * Diagnostic completion counter.
 *
 * Uses Upstash Redis (Vercel KV) when KV_REST_API_URL + KV_REST_API_TOKEN are set.
 * Falls back to in-memory counter with floor of 247.
 */

import { Redis } from "@upstash/redis";

const KV_KEY = "diagnostic_completions";
const FLOOR = 247;

let memCount = FLOOR;

function hasKv(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
  );
}

function getRedis(): Redis {
  return new Redis({
    url: process.env.KV_REST_API_URL as string,
    token: process.env.KV_REST_API_TOKEN as string,
  });
}

export async function getCount(): Promise<number> {
  if (!hasKv()) return memCount;

  try {
    const redis = getRedis();
    const val = await redis.get<number>(KV_KEY);
    return Math.max(val ?? 0, FLOOR);
  } catch (err) {
    console.error("[counter] KV read failed:", err);
    return memCount;
  }
}

export async function incrementCount(): Promise<number> {
  memCount++;

  if (!hasKv()) return memCount;

  try {
    const redis = getRedis();
    const newVal = await redis.incr(KV_KEY);
    return Math.max(newVal, FLOOR);
  } catch (err) {
    console.error("[counter] KV increment failed:", err);
    return memCount;
  }
}
