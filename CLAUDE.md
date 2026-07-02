# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**meowation** — cat avatar generator. React frontend + Cloudflare Workers backend.

- Frontend: `app/` (React Router 8, file-based routing)
- Backend: `workers/app.ts` (Cloudflare Workers)

## Toolchain: Vite+

This project uses **Vite+** (`vp` CLI), a unified wrapper around Vite, Vitest, Oxlint, and Oxfmt. Do **not** invoke the `vite` CLI directly.

```
pnpm dev        # dev server
pnpm build      # production build
pnpm check      # format + lint + typecheck (all in one)
pnpm test       # run tests
pnpm deploy     # build + wrangler deploy to Cloudflare
pnpm cf-typegen # regenerate Cloudflare worker types
```

Run `pnpm check` before considering any change complete.

## Code Style

- TypeScript strict mode with `noUncheckedIndexedAccess: true`
- Formatting and linting via `vp check` (Oxfmt + Oxlint) — no Prettier, ESLint, or Biome
- No `import React` needed in `.tsx` files (react-jsx transform)

## Generated Files

Do not edit these — they are auto-generated:

- `.react-router/` — route types (regenerated on `pnpm dev`/`pnpm build`)
- `workers-configuration.d.ts` — Cloudflare worker types (regenerate with `pnpm cf-typegen`)
