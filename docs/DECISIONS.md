# Architectural Decisions

## Persistence: In-Memory Store

**Choice:** In-memory `Map` for v1.

**Rationale:** Vercel serverless functions are ephemeral — data does not persist across cold starts. For the v1 demo, this is acceptable because the submit-final endpoint computes scores, stores them, and returns the result ID in a single request. The results page reads from the same serverless process.

**Limitation:** Results are lost on cold start. A user who bookmarks a result URL and returns later will see a 404.

**v2 path:** Swap to Vercel KV or Vercel Postgres for durable persistence. The store module (`src/lib/store.ts`) has a clean interface that makes this a drop-in replacement.

## Styling: Tailwind CSS v4 with Custom Theme

**Choice:** Tailwind v4 `@theme inline` for brand colors, no additional CSS-in-JS.

**Rationale:** Spec requires Tailwind. v4's inline theme approach avoids a separate config file and keeps colors co-located with the stylesheet.

## Scoring Engine: Pure TypeScript Module

**Choice:** Pure function at `src/lib/scoring.ts`, zero I/O, zero async.

**Rationale:** Spec mandates portability and testability. The scoring function is unit-tested with Vitest.

## PDF Generation: Stub

**Choice:** Stubbed. Returns a JSON message indicating PDF is not yet configured.

**Rationale:** `@sparticuz/chromium` + Puppeteer adds significant bundle size and cold-start latency. Stubbed per spec guidance.

## Email: Stub via Console.log

**Choice:** All email (Resend) calls log to console and return mock success.

**Rationale:** No RESEND_API_KEY provided. The integration module exists at `src/lib/integrations/resend.ts` ready for activation.

## CRM: Stub via Console.log

**Choice:** All HubSpot form submissions log to console and return mock success.

**Rationale:** No HUBSPOT_PORTAL_ID or form GUIDs provided.

## Validation: Zod v4

**Choice:** Zod for all API input validation.

**Rationale:** Spec requirement. Using Zod v4 (installed as `zod` with `zod/v4` import).

## Framework: Next.js 16 (App Router)

**Choice:** Next.js 16.2.4 with App Router (spec said 15, but `create-next-app@latest` installed 16).

**Rationale:** Next.js 16 is backwards-compatible with the App Router patterns specified. No breaking changes for this use case.
