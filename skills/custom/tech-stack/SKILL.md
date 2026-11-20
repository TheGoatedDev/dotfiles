---
name: tech-stack
description: Use when starting a new project, scaffolding an app, choosing a library or framework, or adding a dependency. Defines the user's default TypeScript stack (TanStack Start, Hono, Postgres + Drizzle, Better Auth, Zod, shadcn/ui, Expo, OpenTelemetry). Also when the user says "my stack", "usual stack" or "set up a new app".
---

# Tech stack

Defaults for new work. In an existing project, follow what the project already uses, even when it differs from this list.

Look up current docs with `find-docs` before you write setup code for any item below. Do not rely on memory for API details.

## Core

| Layer | Choice | Related skill |
|-------|--------|---------------|
| Language | TypeScript (strict) | |
| Runtime / package manager | Node + pnpm (workspaces, catalogs) | `pnpm` |
| Monorepo | Turborepo, only when there are several packages | `turborepo` |
| Lint / format | Biome | |
| Web framework | TanStack Start (TanStack Router, Vite) | |
| Server state | TanStack Query (router integration) | |
| API | Hono | |
| Database | Postgres | |
| ORM / migrations | Drizzle (`drizzle-kit`) | |
| Auth | Better Auth (Drizzle adapter) | |
| Validation | Zod 4 | |
| Env vars | `@t3-oss/env-core` (Zod, client/server split) | |

## App

| Concern | Choice |
|---------|--------|
| UI | shadcn/ui + Tailwind CSS (`shadcn` skill) |
| Icons / toasts | `lucide-react`, `sonner` |
| Forms | React Hook Form + `@hookform/resolvers/zod` + shadcn `Form` |
| Client state | React state + TanStack Router search params; Zustand for global state |
| Dates | `date-fns` |
| IDs | CUID2 (`@paralleldrive/cuid2`) |
| Email | Resend + React Email |
| File storage | S3-compatible API: `s3mini` default; `aws4fetch` for signing/presign only; `@aws-sdk/client-s3` only for features the light clients lack |
| Payments | Polar for selling to individuals (merchant of record); Stripe (Better Auth plugin) for B2B or marketplaces |
| AI / LLM | Vercel AI SDK |
| i18n | Paraglide JS (inlang), shared `packages/i18n` |
| Product analytics / flags / client errors | PostHog (`posthog:*` skills) |
| Issues | Linear (`linear-workflow` skill) |

## Telemetry

OpenTelemetry for traces, metrics and logs on the server.

- Node: `@opentelemetry/sdk-node` + `@opentelemetry/auto-instrumentations-node`, loaded with `node --import ./instrumentation.ts` before the app.
- Hono routes: `@hono/otel`. Drizzle queries come through the `pg` auto-instrumentation.
- Logs: `pino`, bridged with `@opentelemetry/instrumentation-pino` so records carry trace IDs.
- Export plain OTLP only. Configure with `OTEL_*` env vars (`OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`). No vendor SDKs or distros. The backend is chosen per project.
- Manual spans only for business operations.
- Server only. Browser and mobile errors and replays stay in PostHog.

## Mobile

| Concern | Choice |
|---------|--------|
| Framework | Expo + Expo Router, builds and releases via EAS |
| Styling | NativeWind |
| Auth | `@better-auth/expo` against the web backend |
| i18n | Same Paraglide `packages/i18n`, locale from `expo-localization` |
| Layout | Same Turborepo as web: `apps/web`, `apps/mobile`, shared `packages/*` |

## Testing

- Unit / component: Vitest + `@testing-library/react` + happy-dom.
- DB: PGlite for Drizzle tests. Testcontainers Postgres when you need real Postgres extensions.
- E2E: Playwright.

## Rules

- IDs: Drizzle `text('id').primaryKey().$defaultFn(() => createId())`. Set Better Auth `advanced.database.generateId: () => createId()` so auth tables match. Postgres cannot generate CUID2, so raw SQL inserts must pass an ID.
- One Zod schema per form, shared by the client form and the server function. The server always validates again.
- Do not add an alternative to a listed choice (for example Prisma, ESLint, Prettier, NextAuth, Express, Formik) unless the user asks.
- Need something not listed? Prefer the standard library or a dependency the project already has. Ask before you add a new framework-level dependency.

## Per project (ask the user)

Deployment and hosting, telemetry backend, background jobs, realtime, rate limiting, storage provider. Languages other than TypeScript have no default here.
