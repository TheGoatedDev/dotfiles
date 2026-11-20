---
name: tech-stack
description: Use when starting a new project, scaffolding an app, choosing a library or framework, or adding a dependency. Defines the user's default tech stack (TanStack Start, Postgres + Drizzle, Better Auth, Hono, pnpm, Biome, shadcn/ui). Also when the user says "my stack", "usual stack" or "set up a new app".
---

# Tech stack

Defaults for new work. In an existing project, follow what the project already uses, even when it differs from this list.

## Defaults

| Layer | Choice | Related skill |
|-------|--------|---------------|
| Language | TypeScript (strict) | |
| Web framework | TanStack Start (TanStack Router, Vite) | |
| API | Hono | |
| Database | Postgres | |
| ORM / migrations | Drizzle (`drizzle-kit`) | |
| Auth | Better Auth (Drizzle adapter) | |
| UI | shadcn/ui + Tailwind CSS | `shadcn` |
| Lint / format | Biome | |
| Package manager | pnpm (workspaces, catalogs) | `pnpm` |
| Monorepo | Turborepo, only when there are several packages | `turborepo` |
| Analytics / flags / errors | PostHog | `posthog:*` |
| Issues | Linear | `linear-workflow` |

## Rules

- Look up current docs with `find-docs` before you write setup code for any item above. Do not rely on memory for API details.
- Do not add an alternative to a listed choice (for example Prisma, ESLint, Prettier, NextAuth, Express) unless the user asks.
- Need something not listed? Prefer the standard library or a dependency the project already has. Ask before you add a new framework-level dependency.
- Deployment and hosting are not defined here. They change per project. Ask the user.
