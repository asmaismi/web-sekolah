# Phase P0 — Type SSOT & Guardrails

## Install
```bash
pnpm install
pnpm dlx husky init  # or: npx husky init
```

## Scripts
- `pnpm typecheck` — run TypeScript checks
- `pnpm lint` — run ESLint (0 warnings allowed)
- `pnpm fix` — format with Prettier

## Pre-commit
Husky runs `typecheck` and `lint` before commit. If you use npm/yarn, hook auto-detects.
