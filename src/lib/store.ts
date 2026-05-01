/**
 * Persistence layer — v1 uses in-memory Map with JSON serialization.
 *
 * For Vercel serverless (ephemeral), this means data persists only within
 * a single function invocation. For v1 demo purposes this is acceptable:
 * the submit-final endpoint computes + stores + redirects in one request,
 * and the results page reads from the same invocation context via a cookie/URL.
 *
 * For production: swap to Vercel KV, Vercel Postgres, or Vercel Blob.
 * TODO(env): swap when persistence backend is configured.
 */

import { type ScoreResult } from "./scoring";

// In serverless, each cold start gets a fresh Map. For the demo flow
// (submit → redirect → read), we write results to a global that persists
// within the same Node.js process (works for Vercel's function reuse).
const results = new Map<string, ScoreResult>();

// Gate submissions (Q1-Q6 + email)
const gates = new Map<
  string,
  {
    answers: Record<string, string | string[]>;
    email: string;
    firstName: string;
    company: string;
    role: string;
    category: string;
  }
>();

export function saveGate(
  id: string,
  data: {
    answers: Record<string, string | string[]>;
    email: string;
    firstName: string;
    company: string;
    role: string;
    category: string;
  },
): void {
  gates.set(id, data);
}

export function getGate(
  id: string,
): {
  answers: Record<string, string | string[]>;
  email: string;
  firstName: string;
  company: string;
  role: string;
  category: string;
} | undefined {
  return gates.get(id);
}

export function saveResult(result: ScoreResult): void {
  results.set(result.id, result);
}

export function getResult(id: string): ScoreResult | undefined {
  return results.get(id);
}
