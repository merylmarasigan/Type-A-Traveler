# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev           # Start dev server on port 3000
pnpm build         # Production build
pnpm preview       # Preview production build
pnpm test          # Run Vitest tests
pnpm lint          # Run ESLint
pnpm format        # Run Prettier format check
pnpm check         # Prettier write + ESLint fix (auto-fix)

# Database
pnpm db:generate   # Generate Drizzle migration files
pnpm db:migrate    # Run pending migrations
pnpm db:push       # Push schema directly to DB (dev only)
pnpm db:studio     # Open Drizzle Studio GUI
pnpm db:seed       # Seed with sample data
pnpm db:reset      # Full wipe and recreate
```

Run a single test file: `pnpm test src/path/to/file.test.ts`

## Adding UI Components

Use Shadcn to install new components:

```bash
pnpm dlx shadcn@latest add <component-name>
```

Components are placed in `src/components/ui/`.

## Architecture

**Type-A-Traveler** is a travel itinerary planning app built on the TanStack ecosystem with a PostgreSQL backend.

### Stack

- **Framework**: TanStack React Start (SSR-capable React framework)
- **Routing**: TanStack Router (file-based, auto-generates `src/routeTree.gen.ts`)
- **Server state**: TanStack React Query
- **Forms**: TanStack React Form + Zod validation
- **ORM**: Drizzle ORM with PostgreSQL
- **Auth**: Better Auth (email/password + Google OAuth, username plugin)
- **UI**: Shadcn UI + Radix UI + Tailwind CSS v4
- **Build**: Vite + Nitro (server)

### Data Flow

1. **Routes** (`src/routes/`) define pages and API endpoints. API routes live under `src/routes/api/`.
2. **Server functions** (TanStack React Start) provide type-safe client-server communication.
3. **Services** (`src/services/backend/`) contain `*.api.ts` files (server functions) and `*.options.ts` files (React Query options). Hooks in `src/hooks/` wrap these for component use.
4. **DB queries** (`src/db/queries/`) are called from server functions only — never from client code.
5. **External APIs**: Foursquare (activity search), TripAdvisor (location info), Geonames (city search). Toggle mock data with `VITE_USE_MOCK_API=true`.

### Database Schema

Tables in `src/db/schema/`:
- `auth.ts` — Better Auth managed tables (user, session, account, verification)
- `app.ts` — App tables: `itinerary_folders` -> `city_itineraries` -> `itinerary_days` -> `time_slots`, plus `saved_activities` and `lodging`
- `relations.ts` — Drizzle relationship definitions (cascade deletes throughout)
- `columns.helpers.ts` — Shared column definitions (timestamps, IDs)

Zod schemas and TypeScript types derived from the schema live in `src/db/types.ts`.

### Auth

- Server setup: `src/lib/auth.ts`
- Client setup: `src/lib/auth-client.ts`
- Route handler: `src/routes/api/auth/$.ts`
- Authorization guards are enforced on both server (query level) and client (component level)

### Path Alias

`@/*` resolves to `./src/*` — use this for all imports.

### Code Style

Prettier config: no semicolons, single quotes, trailing commas. Run `pnpm check` to auto-fix formatting and lint issues.

## Environment Variables

```
DATABASE_URL
BETTER_AUTH_URL
BETTER_AUTH_SECRET
NODE_ENV
GEONAMES_USERNAME
FOURSQUARE_API_KEY
TRIPADVISOR_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
VITE_USE_MOCK_API   # Set to "true" to use mock data in development
```
