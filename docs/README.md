# Amazon. Diagnosed.

A free 9-question diagnostic that grades a brand's Amazon performance against the top 10% in their category. Built by Neato.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev        # Development server
pnpm build      # Production build
pnpm start      # Start production server
pnpm test       # Run scoring engine tests
pnpm typecheck  # TypeScript type check
pnpm lint       # ESLint
```

## Deploy

```bash
vercel --prod
```

No environment variables required for v1 — all external integrations are stubbed.

## Environment Variables

See `.env.example` for the full list. None are required for the demo to function.

## Architecture

- **Scoring engine:** `src/lib/scoring.ts` — pure function, no I/O, unit-tested
- **Persistence:** In-memory store (v1) — see `docs/DECISIONS.md`
- **API routes:** `/api/submit-gate`, `/api/submit-final`, `/api/pdf/[id]`
- **Pages:** Landing (`/`), Diagnostic (`/start`, `/start/details`), Results (`/results/[id]`), Methodology (`/methodology`)
