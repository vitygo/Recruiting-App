# RecruitApex — Architecture Review
**Date:** 2026-06-08  
**Scope:** Full monorepo (`apps/api` + `apps/web`)  
**Reviewer:** Senior Fullstack Architect (automated deep-scan)

---

## TABLE OF CONTENTS

- [Part 1 — System Architecture & Tech Stack Blueprint](#part-1--system-architecture--tech-stack-blueprint)
  - [1.1 Repository Structure](#11-repository-structure)
  - [1.2 Frontend Stack](#12-frontend-stack)
  - [1.3 Design System](#13-design-system)
  - [1.4 Backend Stack](#14-backend-stack)
  - [1.5 Database & ORM](#15-database--orm)
  - [1.6 Tooling & Build System](#16-tooling--build-system)
  - [1.7 Data Flow Diagram](#17-data-flow-diagram)
- [Part 2 — Codebase Audit & Quality Gates](#part-2--codebase-audit--quality-gates)
  - [2.1 Architectural Patterns & State Regulation](#21-architectural-patterns--state-regulation)
  - [2.2 Frontend Accessibility (A11y) & Semantics](#22-frontend-accessibility-a11y--semantics-wcag-22-aa)
  - [2.3 Security & Authentication Integrity](#23-security--authentication-integrity)
  - [2.4 Web Performance & Core Web Vitals](#24-web-performance--core-web-vitals)
  - [2.5 Migration & Scalability Roadmap](#25-migration--scalability-roadmap-sqlite--postgresql)

---

---

# PART 1 — SYSTEM ARCHITECTURE & TECH STACK BLUEPRINT

## 1.1 Repository Structure

```
recruitApex/
├── package.json               # npm workspaces root — defines "apps/*" workspace glob
├── apps/
│   ├── api/                   # Node.js/Express REST API
│   │   ├── src/
│   │   │   ├── controllers/   # Business logic handlers
│   │   │   ├── middleware/    # Auth + validation guards
│   │   │   ├── routes/        # Express router declarations
│   │   │   ├── schemas/       # Zod input validation schemas
│   │   │   └── lib/           # Prisma singleton, JWT helpers, seed
│   │   └── prisma/
│   │       ├── schema.prisma  # Data model definitions
│   │       └── dev.db         # SQLite database file (local dev)
│   └── web/                   # React SPA
│       └── src/
│           ├── api/           # Axios HTTP client + per-resource modules
│           ├── components/    # Shared UI primitives + layout shell
│           ├── hooks/         # Custom React hooks
│           ├── lib/           # demoStorage (localStorage bridge)
│           ├── pages/         # Route-level page components (each page is self-contained)
│           ├── store/         # Zustand global stores
│           ├── styles/        # Global CSS design tokens
│           └── types/         # Shared TypeScript interfaces
```

This is a **2-app npm-workspace monorepo** — no shared packages between `api` and `web`. The two apps have zero shared code: types are duplicated (TypeScript interfaces in `apps/web/src/types/index.ts` mirror the Prisma schema structure but are maintained manually).

---

## 1.2 Frontend Stack

### React 19
**What it is:** The core declarative UI library.  
**Role in this project:** Renders all SPA views — landing page, auth forms, dashboard, pipeline board, candidates, jobs, interviews, and settings. Uses React 19's Concurrent Mode implicitly via `StrictMode` in `apps/web/src/main.tsx`.  
**Connections:** Feeds data from TanStack Query and Zustand stores into component trees. All pages use `React.lazy()` + `<Suspense>` for route-level code splitting.

### TypeScript 6 (`~6.0.2`)
**What it is:** Statically typed superset of JavaScript.  
**Role:** Enforces type safety across all frontend code. Config (`tsconfig.app.json`) enables strict mode, `noUnusedLocals`, `noUnusedParameters` — a solid baseline. The project does NOT share types with the backend, meaning frontend `types/index.ts` is a manual mirror of `schema.prisma` and can silently drift.  
**Connections:** Compiled by Vite (no separate `tsc` emit in dev — Vite strips types at dev time, full `tsc -b && vite build` runs only on production build).

### Vite 8 (`^8.0.12`)
**What it is:** ES-module-first dev server and bundler (Rollup under the hood).  
**Role:** Serves HMR in dev; bundles production assets. Configured with a single `/api` proxy rule pointing to `http://localhost:3001` (`apps/web/vite.config.ts`), which eliminates CORS issues in dev by routing all API calls through the Vite dev server.  
**Connections:** Feeds the `@vitejs/plugin-react` plugin which handles JSX transform and fast refresh. In production, the built `/dist` would need to be served behind a reverse proxy (nginx/Caddy) that also forwards `/api` to the Express server.

### React Router DOM 7 (`^7.16.0`)
**What it is:** Declarative client-side routing for SPAs.  
**Role:** Controls all page navigation. Routes are defined in `apps/web/src/App.tsx` with lazy-loaded page components wrapped in `<ProtectedRoute>`. The wildcard `path="*"` redirects to `/`.  
**Connections:** `ProtectedRoute` component reads from the Zustand `authStore` to decide whether to render the child page or redirect to `/login`. `useSearchParams` is used in `PipelinePage` to support direct-link job filtering (`/pipeline?job=<id>`).

### TanStack React Query 5 (`^5.101.0`)
**What it is:** Async state management and server-cache library.  
**Role:** The entire server-data layer. Every API call (`GET` endpoints) is wrapped in `useQuery`, and all mutations (`POST/PATCH/DELETE`) use `useMutation` with `queryClient.invalidateQueries()` to keep the cache synchronized after writes. Global config is in `apps/web/src/main.tsx`: `staleTime: 30s`, `gcTime: 5min`, `retry: 1`, `refetchOnWindowFocus: false`.  
**Connections:** Single `QueryClient` instance provided at root via `QueryClientProvider`. The pipeline drag-and-drop uses `queryClient.setQueryData()` for optimistic UI updates before the mutation resolves.

### Zustand 5 (`^5.0.14`)
**What it is:** Minimal global state manager (no boilerplate, no Context overhead).  
**Role:** Manages three global slices of client-side state:
- `authStore` — Authenticated user object, `isAuthenticated`, `isLoading`, `initAuth()` bootstrap, `logout()`.
- `themeStore` — Dark/light theme toggle, persisted to `localStorage`.
- `orgStore` — Company display name, persisted via `demoStorage.ts` to `localStorage`.

**Connections:** `authStore.initAuth()` is called once on app mount in `App.tsx`. It fires a `/api/auth/refresh` request to bootstrap the session on every page load or hard refresh.

### @dnd-kit (`core: ^6.3.1`, `sortable: ^10.0.0`, `utilities: ^3.2.2`)
**What it is:** Accessible, modular drag-and-drop toolkit for React.  
**Role:** Powers the entire Kanban pipeline board. `DndContext` wraps the board; `useSortable` makes each `PipelineCard` a draggable/sortable item; `useDroppable` makes each `PipelineColumn` a drop target. `DragOverlay` renders a floating ghost card while dragging.  
**Connections:** Drag events propagate up to `PipelinePage/index.tsx` which owns all drag handlers (`handleDragStart`, `handleDragOver`, `handleDragEnd`). Only `PointerSensor` is configured — no `KeyboardSensor` is registered. Cross-column drops immediately fire `updateStageMutation` to persist to the database.

### Axios 1 (`^1.16.1`)
**What it is:** Promise-based HTTP client with interceptor support.  
**Role:** All API communication. The singleton `client` in `apps/web/src/api/client.ts` attaches the in-memory access token to every request via a request interceptor. A response interceptor handles 401 errors by silently refreshing the token (via `/api/auth/refresh`) and retrying the failed request — transparently to callers. A `refreshPromise` singleton prevents concurrent refresh storms.  
**Connections:** Every resource API module (`auth.ts`, `candidates.ts`, `jobs.ts`, etc.) imports this `client` and wraps endpoints in typed async functions exported to page components.

### Sonner 2 (`^2.0.7`)
**What it is:** Lightweight, opinionated toast notification library.  
**Role:** User feedback for async operations — success/error messages for candidate creation, pipeline moves, form submissions. `<Toaster>` is mounted at root in `main.tsx` with global style overrides to match the design token system.  
**Connections:** `toast.success()` / `toast.error()` called inside `useMutation` `onSuccess`/`onError` callbacks across all page-level components.

### React Hook Form 7 + Zod 4 (`@hookform/resolvers ^5.4.0`)
**What it is:** Performant, uncontrolled form library + schema validation.  
**Role:** Partially adopted — used in `LoginForm.tsx` and `RegisterForm.tsx`. The majority of modals (`CandidateFormModal`, `ScheduleModal`, `AddJobModal`) use hand-rolled controlled state + inline validation instead. This is an inconsistency: two competing form patterns coexist in the codebase.  
**Connections:** Where used, Zod schemas (frontend-side, v4) validate login/register fields before submission.

### @phosphor-icons/react 2 (`^2.1.10`)
**What it is:** Icon library (6 weight variants per icon, tree-shakeable).  
**Role:** All UI icons across the application — navigation, action buttons, status indicators, modal chrome. Imported per-icon via the subpath pattern (`@phosphor-icons/react/SquaresFour`) in `AppLayout.tsx` to maximize tree-shaking.  
**Connections:** Pure presentational — renders inline SVGs. Also installed at root workspace level (double-installation risk — see audit).

### date-fns 4 (`^4.4.0`)
**What it is:** Functional date utility library.  
**Role:** Calendar rendering in `InterviewsPage` (week grid, date formatting, day grouping). `apps/web/src/pages/InterviewsPage/utils/` contains `calendar.ts`, `date.ts`, `avatar.ts` utilities built on top of `date-fns`.  
**Connections:** Only used in `InterviewsPage`. `PipelineCard` has its own local `formatAppliedAt()` function that does not use `date-fns`.

---

## 1.3 Design System

### Custom CSS Design Token System (`apps/web/src/styles/globals.css`)
**What it is:** A handcrafted design token system using CSS Custom Properties (CSS Variables).  
**Role:** The single source of truth for all visual values: color palette, typography scale, border radii, spacing units, gradients. NOT Tailwind CSS — every value is a CSS variable consumed by CSS Modules.  

**Token categories:**
- Colors: `--c-canvas`, `--c-surface-1`, `--c-surface-2`, `--c-hairline`, `--c-ink`, `--c-ink-muted`, `--c-accent` (#0099ff), `--c-success`, `--c-orange`, etc.
- Gradients: `--main-gradient` (orange → blue), used in hero and CTA sections.
- Typography: `--f-display` / `--f-body` (both map to Inter), radius scale (`--r-xs` → `--r-full`), spacing scale (`--sp-xxs` → `--sp-section`).
- Fluid/responsive tokens using `clamp()` for section padding and container widths.

**Theming:** Dark mode is the default (`:root` block). Light mode overrides are applied via `[data-theme="light"]` attribute on `<html>`. Theme is toggled in `themeStore` and persisted to `localStorage`.

**CSS Modules:** Every component has a co-located `.module.css` file. There is no global utility class generation (no Tailwind, no UnoCSS). Global classes (`.btn`, `.btn-primary`, `.card`, `.input`, `.reveal`) are defined in `globals.css` and used sparingly.

### Typography
- **Inter** (Google Fonts CDN) — primary font for all display and body text.
- **Arimo** (Google Fonts CDN) — imported but not actively referenced in `globals.css` variable assignments. Appears to be unused.
- Fluid type scale: `clamp()`-based sizes for display headings (`.t-display-xxl` down to `.t-caption`).

---

## 1.4 Backend Stack

### Node.js + Express 4 (`^4.21.0`)
**What it is:** Minimal, unopinionated HTTP server framework.  
**Role:** REST API exposing 7 route namespaces (`/api/auth`, `/api/candidates`, `/api/jobs`, `/api/pipeline`, `/api/interviews`, `/api/notes`, `/api/demo`). Follows a Controller-Route-Schema pattern: routes define HTTP verbs and apply middleware; controllers contain business logic; schemas validate inputs.  
**Connections:** All routes except `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh` are protected by `authMiddleware`.

### Helmet 7 (`^7.1.0`)
**What it is:** Collection of Express middleware that sets security-relevant HTTP response headers.  
**Role:** Applies CSP (defaults), X-Frame-Options, X-Content-Type-Options, HSTS (in production), etc. Protects against common web attack vectors at the HTTP header level.  
**Connections:** Applied globally as the first middleware in `apps/api/src/index.ts`.

### CORS (`^2.8.5`)
**What it is:** Cross-Origin Resource Sharing middleware.  
**Role:** Allows the frontend (origin: `http://localhost:5173` in dev, `FRONTEND_URL` env var in production) to make credentialed requests. `credentials: true` is required for cookies to be sent cross-origin. `app.options('*', cors())` handles preflight requests.  
**Connections:** Interacts with the `withCredentials: true` setting on the Axios client and the `SameSite=strict` flag on the refresh token cookie.

### express-rate-limit 7 (`^7.4.0`)
**What it is:** Request rate limiting middleware.  
**Role:** Limits all API requests to 500/15min in production, 1000/15min in development (generous dev limit). Global — not per-endpoint.  
**Connections:** Applied after CORS and before route mounting. In production this should be tightened significantly on auth endpoints.

### bcryptjs 2 (`^2.4.3`)
**What it is:** Pure-JavaScript bcrypt implementation for password hashing.  
**Role:** Hashes user passwords on registration with cost factor 12 (registration) or 10 (demo seed). Verifies password on login via `bcrypt.compare()`.  
**Connections:** Used only in `auth.controller.ts` and `seed.ts`. The cost factor difference (12 vs 10 in seed) is a minor inconsistency — both are acceptable but should be normalized.

### jsonwebtoken 9 (`^9.0.2`)
**What it is:** JWT signing and verification library.  
**Role:** Issues short-lived access tokens (15 minutes) and long-lived refresh tokens (7 days). Secrets are read from `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` environment variables, falling back to hardcoded dev values.  
**Connections:** `generateAccessToken()` / `generateRefreshToken()` called on login/register/refresh. `verifyAccessToken()` called by `authMiddleware` on every protected request.

### cookie-parser 1 (`^1.4.7`)
**What it is:** Express middleware that parses `Cookie` headers into `req.cookies`.  
**Role:** Enables reading the `httpOnly` refresh token cookie in the `/api/auth/refresh` and `/api/auth/logout` endpoints.  
**Connections:** The refresh token cookie is set with `httpOnly: true`, `secure: true` (production), `sameSite: 'strict'`. It is never readable by JavaScript — the access token alone is stored in memory (`api/client.ts`).

### Zod 3 (`^3.23.8`) — Backend
**What it is:** TypeScript-first runtime schema validation.  
**Role:** Validates all incoming request bodies before they reach controllers. The `validate` middleware wraps any `ZodSchema` and returns a structured `400` with field-level errors on failure.  
**Connections:** Schemas in `apps/api/src/schemas/` mirror what the frontend sends. Note: the frontend uses Zod v4, the backend uses Zod v3. This is a version split — breaking changes between v3 and v4 mean schemas cannot be shared.

---

## 1.5 Database & ORM

### Prisma ORM 5 (`^5.19.1`) + SQLite (dev.db)
**What it is:** Next-generation ORM with a declarative schema, type-safe query builder, and migration system.  
**Role:** All database reads and writes go through the Prisma client singleton (`apps/api/src/lib/prisma.ts`). The schema (`apps/api/prisma/schema.prisma`) defines 6 models.

**Data Model:**
```
User (1) ──── (N) Job
     (1) ──── (N) Candidate
     (1) ──── (N) Interview
     (1) ──── (N) Note
     (1) ──── (N) RefreshToken

Job (1) ─────────────┐
Candidate (1) ───────┤── CandidateJob (pivot, @@unique([candidateId, jobId]))
                     └── has stage, aiScore, aiReason, rejectionReason

Candidate (1) ── (N) Note        (CASCADE delete)
Candidate (1) ── (N) Interview   (CASCADE delete)
Candidate (1) ── (N) CandidateJob (CASCADE delete)
Job (1) ──────── (N) CandidateJob (CASCADE delete)
```

**Cascade Behavior:** Deleting a `Candidate` cascades to their `Note`, `Interview`, and `CandidateJob` records. Deleting a `Job` cascades to `CandidateJob` records. `User` deletion has no cascades defined — orphaned records would result (no `onDelete: Cascade` on `Job.user`, `Candidate.user`, etc.).

**Enum simulation:** Prisma's SQLite provider does not support native enums. All status/type fields (`role`, `status`, `stage`, `type`, `source`) are stored as `String` with no DB-level constraint. Enforcement is entirely at the Zod schema layer.

**Singleton pattern:** `apps/api/src/lib/prisma.ts` attaches the client to `globalThis` to prevent connection pool exhaustion during `ts-node-dev` hot reloads.

**Seeding:** `runSeedIfEmpty()` runs on server boot — if no users exist, it creates a full demo workspace (1 user, 4 jobs, 12 candidates, 12 pipeline entries, 4 interviews). `seedForUser()` runs on every new user registration, giving them a pre-populated demo workspace.

---

## 1.6 Tooling & Build System

| Tool | Version | Role |
|---|---|---|
| npm workspaces | (npm built-in) | Monorepo link — `apps/*` hoisted to root `node_modules` |
| Vite 8 | `^8.0.12` | Frontend dev server + Rollup bundler |
| ts-node-dev 2 | `^2.0.0` | API hot-reload dev runner with TypeScript transpilation |
| TypeScript (web) | `~6.0.2` | Frontend type checking + Vite type stripping |
| TypeScript (api) | `^5.5.3` | Backend type checking + `tsc` compilation to `dist/` |
| ESLint 10 | `^10.3.0` | Frontend linting with react-hooks plugin |
| Prisma CLI | `^5.19.1` | Schema migrations + client generation |

**Dev workflow:**
- `npm run dev:web` → Vite dev server on `:5173` with `/api` proxy to `:3001`
- `npm run dev:api` → `ts-node-dev` on `:3001` with hot reload

**Production build:**
- Web: `tsc -b && vite build` → static assets to `apps/web/dist/`
- API: `tsc` → compiled JS to `apps/api/dist/`, run with `node dist/index.js`

---

## 1.7 Data Flow Diagram

```
Browser (React SPA)
│
├── [Zustand authStore]
│   └── initAuth() on mount → POST /api/auth/refresh → GET /api/auth/me
│
├── [TanStack Query cache]
│   ├── useQuery(['pipeline', jobFilter]) → GET /api/pipeline?jobId=…
│   ├── useQuery(['candidates', search, filter]) → GET /api/candidates?…
│   ├── useQuery(['jobs']) → GET /api/jobs
│   └── useQuery(['interviews']) → GET /api/interviews
│
├── [Axios client] — attaches Bearer token; 401 interceptor silently refreshes
│
└── → HTTP over localhost:5173/api (proxied by Vite to localhost:3001)

Express API (Node.js)
│
├── helmet → cors → json body parser → cookieParser → rateLimit
│
├── /api/auth/* (public routes — register, login, refresh, logout, me)
│   └── validate(schema) → auth.controller
│
├── /api/candidates|jobs|pipeline|interviews|notes|demo
│   └── authMiddleware → validate(schema) → controller
│
└── → Prisma Client

Prisma ORM
│
└── → SQLite (apps/api/prisma/dev.db)
         All queries: parameterized, never raw string interpolation
```

---

---

# PART 2 — CODEBASE AUDIT & QUALITY GATES

> **Severity scale:** CRITICAL (data loss / security breach risk), HIGH (significant bug or compliance gap), MEDIUM (architectural debt or degraded UX), LOW (polish / future-proofing).

---

## 2.1 Architectural Patterns & State Regulation

---

### [CRITICAL] Dual Identity System: DB User vs. localStorage Demo User

**Files:**
- `apps/web/src/store/authStore.ts` — real authenticated DB user
- `apps/web/src/lib/demoStorage.ts` — `DemoUser` shape with name, email, bio, avatarDataUrl
- `apps/web/src/hooks/useUser.ts` — reads from demoStorage, not from authStore
- `apps/web/src/pages/SettingsPage/index.tsx:43` — `ProfileTab` loads from `loadDemoUser()`

**Problem:** There are two parallel user identity systems. The real authenticated user (from DB via `/api/auth/me`) is stored in `authStore`. A *separate* "demo user" profile (name, bio, position, avatarDataUrl) is stored in `localStorage` via `demoStorage`. The Settings page's Profile Tab reads from localStorage, not from the database. Saving profile changes in Settings writes to localStorage — changes are **never persisted to the database**. If the user logs out and back in, their profile changes are gone. The `SecurityTab` in Settings page simulates a password change with frontend-only validation — it never calls any backend endpoint.

**Remediation:** Implement `PATCH /api/auth/me` endpoint accepting `{ name, bio, position, avatarUrl }`. Wire `ProfileTab` to call this endpoint. Wire `SecurityTab` to call a `PATCH /api/auth/password` endpoint that verifies the current password before updating. Remove `useUser()` hook and `demoStorage` user/org keys from the production auth path entirely.

---

### [HIGH] Hardcoded Sidebar Navigation Badges

**File:** `apps/web/src/components/layout/AppLayout.tsx:22-25`

```tsx
{ to: '/pipeline', icon: Kanban, label: 'Pipeline', badge: '14' },
{ to: '/interviews', icon: CalendarBlank, label: 'Interviews', badge: '3' },
```

**Problem:** The "14" and "3" badges in the sidebar are static string literals. They do not reflect actual data. A user with 3 pipeline candidates will see "14" in the nav. This is misleading and will confuse end users as soon as the data diverges from the hardcoded value.

**Remediation:** Remove hardcoded badge strings. Derive badge values from React Query cache data — active pipeline count and upcoming interview count — and pass them into `AppLayout` as props or read from the cache via `useQueryClient().getQueryData()`.

---

### [HIGH] QueryKey Mismatch: Dashboard and PipelinePage Use Different Cache Keys

**Files:**
- `apps/web/src/pages/DashboardPage/index.tsx:42` — `queryKey: ['pipeline']` (no filter)
- `apps/web/src/pages/PipelinePage/index.tsx:39` — `queryKey: ['pipeline', jobFilter]`

**Problem:** React Query treats `['pipeline']` and `['pipeline', 'all']` as entirely different cache entries. The Dashboard and PipelinePage never share their pipeline cache. When a user moves a card on the Pipeline page and then visits the Dashboard, the Dashboard re-fetches independently and vice versa. Every navigation between these two pages triggers a fresh API call even though the data is identical.

**Remediation:** Normalize the pipeline query key. Use `['pipeline', jobFilter]` everywhere and default `jobFilter` to `'all'` at the Dashboard level. This gives both pages a shared cache key when "all jobs" is the filter.

---

### [HIGH] Dashboard Fires 4 Independent Queries on Every Mount

**File:** `apps/web/src/pages/DashboardPage/index.tsx:31-49`

**Problem:** `DashboardPage` issues four separate `useQuery` calls: `candidates` (limit: 100), `jobs`, `pipeline`, `interviews`. These all fire in parallel on mount. The candidates query fetches up to 100 full candidate records just to read `total` (the count), discarding all other data.

**Remediation:** 
1. Create a dedicated `/api/dashboard` endpoint that returns all summary data in one query (stage counts, job counts, upcoming interview slice, total candidate count). This eliminates 3 of 4 round trips.
2. Alternatively, use the `select` option on each `useQuery` to extract only needed fields from shared cache: `select: (data) => data.total` for candidates.

---

### [MEDIUM] Inline `<style>` Tags for Spinner Animation in React Components

**Files:**
- `apps/web/src/App.tsx:34-35` — inline `<style>{@keyframes spin…}</style>`
- `apps/web/src/components/ProtectedRoute.tsx:23-25` — identical inline style block

**Problem:** The loading spinner animation is defined twice as inline `<style>` tags injected into the DOM by React. This is a CSS-in-JS anti-pattern in a CSS Modules codebase. Two identical `@keyframes spin` rules are injected on every render of the spinner. The spinner itself is also duplicated — identical DOM structure and CSS exists in both `App.tsx` (the Suspense fallback) and `ProtectedRoute.tsx`.

**Remediation:** Extract the spinner into the existing `LoadingSpinner` component (`apps/web/src/components/LoadingSpinner.tsx`), which already has a `.module.css` file. Move the `@keyframes spin` rule into that module. Replace both inline spinners with `<LoadingSpinner />`.

---

### [MEDIUM] `DangerTab` "Delete Account" Does Not Call the Backend

**File:** `apps/web/src/pages/SettingsPage/index.tsx:447-449`

```tsx
const handleDeleteAccount = () => {
  localStorage.clear()
  navigate('/register')
}
```

**Problem:** "Delete account" clears localStorage and redirects to `/register`. The authenticated user still exists in the database. The refresh token cookie is still valid. The user can simply visit `/login` with their credentials and log back in. Nothing is actually deleted.

**Remediation:** Implement `DELETE /api/auth/account` endpoint that: (1) deletes all user data via a Prisma transaction (notes, interviews, candidateJobs, candidates, jobs, refreshTokens, then user), (2) clears the refresh token cookie. Call this endpoint in `handleDeleteAccount` before clearing localStorage.

---

### [MEDIUM] `orgStore` Company Name Persisted to localStorage, Not Database

**File:** `apps/web/src/store/orgStore.ts`

**Problem:** The company name displayed in the sidebar is stored in localStorage via `demoStorage`. It is not associated with the authenticated user in the database. Logging in on a different browser/device shows "RecruitApex" regardless of what the user set. This is appropriate for a pure demo, but is a gap if this feature is intended to be a real organizational setting.

**Remediation:** If org branding is a real feature: add a `companyName` field to the `User` model (or create an `Organization` model), persist to DB via Settings, and seed it on registration. Until then, mark the feature in the UI as "device-only" or remove it from the Settings Organization tab.

---

### [LOW] `Arimo` Font Imported But Never Used

**File:** `apps/web/src/styles/globals.css:2`

```css
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400..700;1,400..700&display=swap');
```

**Problem:** Arimo is imported from Google Fonts but neither `--f-display` nor `--f-body` reference it. The font is downloaded by every user for no benefit.

**Remediation:** Remove the Arimo import line.

---

### [LOW] `@phosphor-icons/react` Installed at Both Root and `apps/web`

**Files:** `package.json` (root) and `apps/web/package.json`

**Problem:** Phosphor icons is declared as a dependency in both the root workspace `package.json` and `apps/web/package.json`. npm workspaces hoisting means this *likely* resolves to one copy, but it's a maintenance hazard — version updates must be made in two places and could diverge.

**Remediation:** Remove from root `package.json`. Keep only in `apps/web/package.json` where it is actually used.

---

## 2.2 Frontend Accessibility (A11y) & Semantics (WCAG 2.2 AA)

---

### [CRITICAL] Pipeline Board Has No Keyboard Drag-and-Drop Alternative

**Files:**
- `apps/web/src/pages/PipelinePage/index.tsx:33-36`
- `apps/web/src/pages/PipelinePage/components/PipelineCard/PipelineCard.tsx:95-108`

```tsx
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
)
```

**Problem:** Only `PointerSensor` is registered. There is no `KeyboardSensor`. WCAG 2.1 Success Criterion 2.1.1 (Keyboard) requires that all functionality be operable via keyboard. Drag-and-drop is a pointer-only interaction in the current implementation. Keyboard users cannot move candidates between pipeline stages.

`@dnd-kit` ships a `KeyboardSensor` with coordinateGetter support specifically for this use case.

**Remediation:**
```tsx
import { KeyboardSensor, useSensors, useSensor } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
)
```
Additionally, provide a visible "Move to stage" dropdown in the `CandidateModal` as a pointer-independent alternative (this already exists in the modal — ensure it is discoverable).

---

### [CRITICAL] `CandidateCard` in Candidates Page is a Non-Interactive `<div>` with `onClick`

**File:** `apps/web/src/pages/CandidatesPage/components/CandidateCard/CandidateCard.tsx:44`

```tsx
<div className={styles.card} onClick={() => onClick(candidate)}>
```

**Problem:** This `<div>` is the primary interactive element on the Candidates page — clicking it opens the candidate details modal. It has no `role="button"`, no `tabIndex`, and no `onKeyDown` handler. Keyboard users and screen reader users cannot activate it.

Compare with `PipelineCard` which correctly handles this:
```tsx
// PipelineCard.tsx — correct
<div role="button" tabIndex={0} aria-label="..." onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}>
```

**Remediation:** Either change the element to a `<button>` (preferred) or apply the same `role="button"`, `tabIndex={0}`, and `onKeyDown` pattern used in `PipelineCard`.

---

### [HIGH] Modal Dialogs Missing `role="dialog"`, Focus Trap, and Escape Key Handler

**Affected files:**
- `apps/web/src/pages/CandidatesPage/components/CandidateFormModal/CandidateFormModal.tsx` — no `role="dialog"`, no focus trap, no Escape handler
- `apps/web/src/pages/InterviewsPage/components/ScheduleModal/ScheduleModal.tsx` — no `role="dialog"`, no focus trap, no Escape handler
- `apps/web/src/pages/InterviewsPage/components/InterviewModal/InterviewModal.tsx` — no `role="dialog"`, no focus trap, no Escape handler
- `apps/web/src/pages/JobsPage/components/AddJobModal/AddJobModal.tsx` — no `role="dialog"`, no focus trap, no Escape handler
- `apps/web/src/pages/JobsPage/components/EditJobModal/EditJobModal.tsx` — no `role="dialog"`, no focus trap, no Escape handler

**Problem:** WCAG 2.1 SC 4.1.2 requires dialogs to be correctly announced to assistive technologies. `role="dialog"` and `aria-modal="true"` are missing from 5 of the 7 modal dialogs in the app. Only `PipelinePage/components/CandidateModal` and `PipelinePage/components/AddCandidateModal` have these attributes.

Additionally, none of the modals implement:
1. **Focus trap** — Tab key escapes the modal and reaches background content (WCAG 2.1 SC 2.1.2).
2. **Initial focus management** — When a modal opens, focus must move to the first interactive element inside it.
3. **Return focus** — When closed, focus must return to the element that triggered the modal.
4. **Escape key** — No `useEffect` registers a `keydown` listener for `Escape` to close modals.

**Remediation:** Add `role="dialog"` and `aria-modal="true"` to all modal container divs. Add `aria-labelledby` pointing to the modal title heading. Implement focus trap with a `useEffect` that queries `[tabindex]` elements on mount and traps Tab/Shift-Tab. Register `Escape` key handler. Consider extracting a `<Modal>` primitive that encapsulates all of this.

---

### [HIGH] Pervasive `outline: none` Without `:focus-visible` Replacement

**Affected files (representative, not exhaustive):**
- `apps/web/src/styles/globals.css:266` — `.input { outline: none }`
- `apps/web/src/pages/CandidatesPage/components/CandidateToolbar/CandidateToolbar.module.css:28`
- `apps/web/src/pages/InterviewsPage/InterviewsPage.module.css:97`
- `apps/web/src/pages/LoginPage/components/LoginForm.module.css:45`
- `apps/web/src/pages/PipelinePage/components/PipelineToolbar/PipelineToolbar.module.css:71`
- `apps/web/src/pages/SettingsPage/SettingsPage.module.css:232`

**Problem:** `outline: none` is applied to inputs and interactive elements across the application. While several components replace this with a `box-shadow` focus ring or a `border-color` change on `:focus`, the removal of the default outline is not consistently paired with a custom visible focus indicator. WCAG 2.2 SC 2.4.11 (Focus Appearance, AA) requires focus indicators to have at least a 3:1 contrast ratio with adjacent colors.

`App.css` has a good global rule (`&:focus-visible { outline: 2px solid var(--accent) }`) but `--accent` is not a defined token in `globals.css` — the accent token is `--c-accent`. This rule may silently fail.

**Remediation:**
1. Fix the global focus rule in `App.css`: change `var(--accent)` to `var(--c-accent)`.
2. Replace every `outline: none` with `outline: none` scoped to a `:focus:not(:focus-visible)` rule, ensuring mouse users don't see focus rings while keyboard users do.
3. Audit all interactive elements (buttons, inputs, sortable cards, tab triggers) for visible focus state in keyboard navigation.

---

### [HIGH] Interactive `<span>` Elements Used as Buttons

**Files:**
- `apps/web/src/pages/DashboardPage/components/UpcomingInterviews/UpcomingInterviews.tsx:38`
- `apps/web/src/pages/DashboardPage/components/ActiveJobs/ActiveJobs.tsx:21`

```tsx
<span className={styles.seeAllLink} onClick={onSeeAll} style={{ cursor: 'pointer' }}>See all</span>
<span className={styles.seeAllLink} onClick={onSeeAll} style={{ cursor: 'pointer' }}>See all jobs</span>
```

**Problem:** `<span>` elements with `onClick` are not focusable by keyboard and are announced as text by screen readers, not as interactive controls. These are navigation triggers that should be `<button>` elements or `<Link>` components.

**Remediation:** Replace with `<button type="button" onClick={onSeeAll}>See all</button>` or `<Link to="/jobs">See all jobs</Link>` styled appropriately.

---

### [HIGH] Side-Panel Interview Items Are Non-Interactive `<div>` Elements

**File:** `apps/web/src/pages/InterviewsPage/components/SidePanel/SidePanel.tsx:48`

```tsx
<div key={iv.id} className={styles.upcomingItem} onClick={() => onInterviewClick(iv)}>
```

**Problem:** Same issue as the `CandidateCard` — clickable `<div>` without role, tabIndex, or keyboard handler.

**Remediation:** Change to `<button type="button">` or add `role="button"` with `tabIndex={0}` and `onKeyDown` handler.

---

### [MEDIUM] `LoadingSpinner` Missing `role="status"` for Screen Reader Announcements

**File:** `apps/web/src/components/LoadingSpinner.tsx:15`

```tsx
<div className={styles.spinner} aria-label="Loading">
```

**Problem:** The spinner has `aria-label="Loading"` but no `role="status"` or `aria-live` region. Screen readers will not announce the loading state unless the element has the appropriate live region role. `role="status"` implies `aria-live="polite"` and `aria-atomic="true"`, which is the correct semantic.

**Remediation:** Add `role="status"` to the spinner div. Remove `aria-label` from the spinner icon div and instead put the text in a visually-hidden `<span>` inside: `<span className="sr-only">Loading</span>`.

---

### [MEDIUM] Sidebar Layout Is Not a Semantic `<nav>` With Label

**File:** `apps/web/src/components/layout/AppLayout.tsx:41-113`

**Problem:** The desktop sidebar navigation is wrapped in `<div className={styles.sidebar}>`, not a `<nav>` element. The mobile nav correctly uses `<nav className={styles.mobileNav}>` but the desktop equivalent does not. WCAG SC 1.3.1 (Info and Relationships) requires navigation landmarks to be conveyed semantically.

The main content area is also wrapped in `<div className={styles.main}>` rather than `<main>`.

**Remediation:** Change the desktop sidebar wrapper to `<nav aria-label="Main navigation">`. Change the main content wrapper to `<main>`. Add `aria-label="Main navigation"` to the mobile `<nav>` as well (there are now two nav elements; they need distinguishing labels).

---

### [MEDIUM] Settings Tab Buttons Missing `role="tab"` and Tab Panel Semantics

**File:** `apps/web/src/pages/SettingsPage/index.tsx:518-545`

**Problem:** The settings sidebar renders a list of `<button>` elements acting as tabs, but they are not marked up with the ARIA tab pattern (`role="tab"`, `aria-selected`, `aria-controls`). The content panel is not a `role="tabpanel"`. This means the Tab/Arrow key navigation convention for tabbed interfaces (Left/Right arrows to move between tabs) is not implemented, violating the ARIA Authoring Practices Guide.

**Remediation:** Wrap tab buttons in `<div role="tablist" aria-label="Settings">`. Add `role="tab"` and `aria-selected={isActive}` to each button. Wrap the content area in `<div role="tabpanel" aria-labelledby={activeTab}>`. Add `ArrowUp/ArrowDown` key handler for within-tablist navigation.

---

### [LOW] No Skip Navigation Link

**Problem:** There is no skip-to-main-content link at the top of the page for keyboard users to bypass the sidebar navigation. This is a WCAG 2.4.1 (Bypass Blocks) requirement.

**Remediation:** Add as the very first focusable element in `AppLayout`:
```tsx
<a href="#main-content" className={styles.skipLink}>Skip to main content</a>
```
And give the main content div `id="main-content"` with `tabIndex={-1}`.

---

### [LOW] `SettingsPage` Avatar Click Wrapper Uses Non-Interactive `<div>`

**File:** `apps/web/src/pages/SettingsPage/index.tsx:86`

```tsx
<div className={styles.avatarWrap} onClick={() => fileRef.current?.click()}>
```

**Problem:** Clicking the avatar circle triggers a hidden `<input type="file">`. This `<div>` has no accessibility attributes. Keyboard users cannot trigger the file picker through the avatar UI.

**Remediation:** Change to `<button type="button">` or use `<label htmlFor="avatar-upload">` wrapping the visual element with the `<input type="file" id="avatar-upload">` inside, which provides native keyboard and screen reader support for free.

---

## 2.3 Security & Authentication Integrity

---

### [CRITICAL] JWT Secrets Have Hardcoded Fallback Values

**File:** `apps/api/src/lib/tokens.ts:3-4`

```ts
const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET  || 'dev-access-secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'
```

**Problem:** If the production environment is deployed without setting `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`, the API silently falls back to publicly-known strings. Any attacker who reads the open source code can forge valid JWTs for any user ID. This is a complete authentication bypass.

**Remediation:**
```ts
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set')
}
```
Throw on startup if secrets are absent. Secrets should be minimum 256-bit random strings. Never commit secrets to `.env` in the repository — use a secrets manager (AWS Secrets Manager, Railway Secrets, Doppler) in production.

---

### [HIGH] Seed Function Logs Demo Credentials to `console.log` Unconditionally

**File:** `apps/api/src/lib/seed.ts:266`

```ts
console.log(`Demo data seeded. Login: ${DEMO_EMAIL} / demo123`)
```

**Problem:** The demo credentials `demo@recruitapex.com / demo123` are logged to stdout on every cold-start seed. In a production deployment where the database is empty on first boot (e.g., new instance), these credentials are written to server logs in plaintext. Log aggregation systems (Datadog, CloudWatch, etc.) will capture and store them.

**Remediation:** Gate this log behind `process.env.NODE_ENV !== 'production'` or remove it entirely. In production, send a notification through a secure channel (email, Slack webhook) instead of stdout.

---

### [HIGH] `DELETE /api/demo/clear` Has No Ownership Boundary Beyond userId

**File:** `apps/api/src/controllers/demo.controller.ts`

**Problem:** The endpoint correctly scopes deletion to the authenticated `userId`. However, it executes a Prisma `$transaction` that deletes notes, interviews, candidateJobs, candidates, and jobs in sequence with no rollback instrumentation. If any step fails mid-transaction, Prisma will attempt to rollback, but error details are swallowed in the `catch` block which only returns a generic 500. Additionally, this is a highly destructive action served by the same global rate limit (1000 req/15min) as all other endpoints — it should have its own, much tighter rate limit.

**Remediation:** Add a separate, tighter rate limit to this endpoint (e.g., 3 requests per hour per user). Log detailed error context on failure.

---

### [HIGH] Auth State Bootstrapped With No Error Boundary Around Double `initAuth()` Call

**File:** `apps/web/src/App.tsx:49`

```tsx
useEffect(() => {
  initAuth()
}, [])
```

`authStore.ts` uses `initPromise` to deduplicate concurrent `initAuth()` calls — a good defensive measure. However, if `initAuth()` itself throws an unhandled error (network down, malformed JSON), the catch block sets `isLoading: false`, but the error is silently swallowed with no user-facing feedback. The app shows a blank page instead of a "Connection error — please retry" state.

**Remediation:** Add an `error` state to `authStore`. Surface a retry UI in `ProtectedRoute` and `App` when `initAuth` fails.

---

### [MEDIUM] `page` and `limit` Query Parameters Not Bounded

**File:** `apps/api/src/controllers/candidates.controller.ts:29-30`

```ts
const { search, source, page = '1', limit = '20' } = req.query
const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
```

**Problem:** `parseInt(limit as string)` has no upper bound. A request with `?limit=1000000` will attempt to fetch 1 million rows in a single Prisma query. No input validation schema is applied to query parameters on the candidates route — only the request body is validated.

**Remediation:** Clamp values: `const safePage = Math.max(1, parseInt(page as string) || 1)` and `const safeLimit = Math.min(100, Math.max(1, parseInt(limit as string) || 20))`. Alternatively, add a Zod schema for query params and run them through the `validate` middleware (which currently only handles `req.body`).

---

### [MEDIUM] Refresh Token Table Grows Unboundedly — No Token Pruning

**File:** `apps/api/src/controllers/auth.controller.ts`

**Problem:** Every login and every token refresh creates a new `RefreshToken` row. Old tokens expire after 7 days (or are replaced by the 10-second grace window rotation). However, expired tokens are never deleted. Over time, the `RefreshToken` table accumulates thousands of stale rows, degrading query performance on the `findUnique({ where: { token } })` lookup and causing the SQLite file to grow.

**Remediation:** Add a cleanup job to delete expired tokens. Options:
1. Run `prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: new Date() } } })` on server startup.
2. Schedule a periodic cleanup (setInterval or cron job) to prune every hour.

---

### [MEDIUM] CORS `allowedHeaders` Too Restrictive — May Break Future Features

**File:** `apps/api/src/index.ts:22-24`

```ts
allowedHeaders: ['Content-Type', 'Authorization'],
```

**Problem:** `Authorization` is in `allowedHeaders` but the auth flow uses both `Authorization` (access token) and `Cookie` (refresh token). Browsers do not need CORS permission to send cookies — `withCredentials: true` handles that. However, some future integrations (e.g., file upload with `Content-Disposition`, webhooks with `X-Webhook-Signature`) will be blocked.

**Remediation:** This is minor, but document why each listed header is needed and add headers proactively for anticipated use cases.

---

### [LOW] `UserDropdown` Logout Clears All of `localStorage`

**File:** `apps/web/src/components/layout/UserDropdown.tsx:55`

```tsx
localStorage.clear()
```

**Problem:** `localStorage.clear()` removes all keys in the storage for this origin — including any keys that other browser tabs or apps on the same origin might be using. It also removes theme preference, forcing the user back to dark mode on their next visit. More surgical: only clear the known demo keys (`is_demo_active`, `has_seen_assistant`, `recruit_demo_*`).

**Remediation:** Replace with targeted key removal: `DEMO_STORAGE_KEYS.forEach(k => localStorage.removeItem(k))`.

---

## 2.4 Web Performance & Core Web Vitals

---

### [HIGH] Google Fonts Loaded Synchronously Via `@import` — Causes Layout Shift

**File:** `apps/web/src/styles/globals.css:1-2`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Arimo:…&display=swap');
```

**Problem:** `@import` in CSS is a render-blocking operation. The browser must fetch, parse, and apply the external stylesheet before rendering the page. This directly contributes to First Contentful Paint (FCP) and Cumulative Layout Shift (CLS) scores. `display=swap` mitigates FOIT (Flash of Invisible Text) but not FOUT (Flash of Unstyled Text), which causes layout shift.

Additionally, the Arimo import is unused (see §2.1), so it's a pure waste of bandwidth.

**Remediation:**
1. Remove the Arimo `@import`.
2. Move the Inter `@import` from CSS to a `<link rel="preconnect">` + `<link rel="preload" as="style">` pair in `apps/web/index.html`.
3. Consider self-hosting Inter using `fontsource` (`npm install @fontsource/inter`) to eliminate the external CDN dependency entirely and enable font subsetting.

---

### [HIGH] Dashboard Fetches Up To 100 Full Candidates Just to Read `total`

**File:** `apps/web/src/pages/DashboardPage/index.tsx:33-35`

```tsx
queryFn: () => candidatesApi.getAll({ limit: 100 }),
// ... only candidatesData?.total is used
```

**Problem:** The Dashboard only needs the total count of candidates, but it fetches up to 100 full candidate objects (with their `candidateJobs` nested relation) just to read `candidatesData.total`. This is wasteful — it serializes, transmits, and deserializes data that is immediately discarded.

**Remediation:** Add a dedicated `GET /api/candidates/count` endpoint (or use a query option): 
```ts
// Quick fix using select on the query
const { data } = useQuery({
  queryKey: ['candidates-count'],
  queryFn: () => candidatesApi.getCount(), // new endpoint: prisma.candidate.count({ where: { userId } })
})
```

---

### [MEDIUM] Pipeline Query Includes Full Candidate and Job Objects — Large Payload

**File:** `apps/api/src/controllers/pipeline.controller.ts:17-24`

```ts
const pipeline = await prisma.candidateJob.findMany({
  where,
  include: {
    candidate: true,  // all fields
    job: true,        // all fields
  },
})
```

**Problem:** For an unfiltered pipeline query, every `CandidateJob` row eagerly loads its full `Candidate` (with linkedinUrl, cvUrl, phone, etc.) and full `Job` (with description, techStack, etc.). The Pipeline board only displays: name, avatar color, source, aiScore, job title. Transmitting full objects for every card is significant over-fetching as the pipeline grows.

**Remediation:** Use Prisma `select` to return only the fields the UI needs:
```ts
include: {
  candidate: { select: { id: true, firstName: true, lastName: true, source: true, avatarUrl: true } },
  job: { select: { id: true, title: true } },
}
```

---

### [MEDIUM] `DashboardPage` Computes Derived Data in Render Without Memoization

**File:** `apps/web/src/pages/DashboardPage/index.tsx:58-80`

```ts
const pipelineByStage = STAGE_ORDER.map(stage => ({
  count: pipeline.filter(p => p.stage === stage).length,
  ...
}))
const stageCounts = STAGES.map(s => pipeline.filter(p => p.stage === s.id).length)
const hiringStages = STAGES.map((s, i) => ({ ... }))
```

**Problem:** `pipeline` is iterated 4 times on every render (twice for `pipelineByStage`, once for `stageCounts`, once for `hiringStages`). While this is negligible at current data scale, these derived arrays are recreated on every re-render, including parent re-renders unrelated to data changes. None of this computation is memoized with `useMemo`.

**Remediation:** Wrap each derivation in `useMemo`:
```ts
const pipelineByStage = useMemo(() => STAGE_ORDER.map(stage => ({
  count: pipeline.filter(p => p.stage === stage).length,
  ...
})), [pipeline])
```

---

### [MEDIUM] No Database Indexes on Frequently-Queried Foreign Keys

**File:** `apps/api/prisma/schema.prisma`

**Problem:** Prisma automatically creates an index on `@id` and `@unique` fields. However, `userId` foreign keys on `Job`, `Candidate`, `Interview`, and `Note` are NOT indexed. Every query that filters by `userId` (which is every query in the app since all data is user-scoped) performs a full table scan on SQLite.

```prisma
model Candidate {
  userId String
  // No @@index([userId])
```

As row counts grow (thousands of candidates per user), query times will increase linearly.

**Remediation:** Add indexes to all frequently-queried foreign key columns:
```prisma
model Candidate {
  userId String
  @@index([userId])
}

model Job {
  userId String
  @@index([userId])
}

model CandidateJob {
  candidateId String
  jobId       String
  @@index([candidateId])
  @@index([jobId])
}

model Interview {
  userId      String
  candidateId String
  @@index([userId])
  @@index([candidateId])
}
```
Run `npx prisma migrate dev --name add_indexes` to generate and apply the migration.

---

### [LOW] No Production Bundle Analysis or Bundle Size Ceiling

**Problem:** There is no bundle analyzer configured (e.g., `rollup-plugin-visualizer`). It is unknown what the current production bundle size is. Dependencies like `date-fns` (large), `@dnd-kit` (moderate), and `@phosphor-icons/react` (variable, depending on tree-shaking) could be contributing more than expected.

**Remediation:** Add `rollup-plugin-visualizer` to `vite.config.ts` temporarily:
```ts
import { visualizer } from 'rollup-plugin-visualizer'
plugins: [react(), visualizer({ open: true })]
```
Run `npm run build` to generate a treemap. Set a CI bundle size budget (e.g., 200kb gzipped per chunk).

---

### [LOW] `hero.png` in `src/assets` — No Optimization or Lazy Loading

**File:** `apps/web/src/assets/hero.png`

**Problem:** The hero image is a `.png` bundled directly into the Vite asset pipeline. No WebP conversion, no responsive srcset, and no explicit lazy loading. PNG is generally the wrong format for photographs (use WebP or AVIF). The Largest Contentful Paint (LCP) candidate is almost certainly the hero image.

**Remediation:** Convert to WebP. Add `loading="lazy"` for below-fold images, or `fetchpriority="high"` for the LCP image (hero). Use `<picture>` with WebP + PNG fallback.

---

## 2.5 Migration & Scalability Roadmap: SQLite → PostgreSQL

This is a complete, ordered technical guide for migrating the development SQLite database to a production PostgreSQL instance.

---

### Phase 0 — Prerequisites

1. Provision a PostgreSQL 15+ instance. Recommended providers: Neon (serverless, generous free tier), Railway, Supabase, AWS RDS. Obtain the connection string in the format:
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
   ```

2. Ensure `DATABASE_URL` is managed via environment secrets — never hardcoded in `.env` committed to git.

3. Install the PostgreSQL adapter for Prisma — it's included in `@prisma/client` already. No new packages needed.

---

### Phase 1 — Schema Provider Swap

**File:** `apps/api/prisma/schema.prisma`

Change the datasource block:
```prisma
// BEFORE
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// AFTER
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Important schema changes required for PostgreSQL compatibility:**

1. **Enum enforcement:** SQLite stores enums as `String`. With PostgreSQL you can enforce them at the DB level with native enums. Add explicit Prisma `enum` declarations:
   ```prisma
   enum PipelineStage {
     APPLIED
     SCREENING
     INTERVIEW
     OFFER
     HIRED
     REJECTED
   }
   
   model CandidateJob {
     stage PipelineStage @default(APPLIED)
     ...
   }
   ```
   Repeat for `JobStatus`, `JobType`, `SourceType`, `InterviewType`, `InterviewStatus`, `NoteType`, `UserRole`.

2. **SQLite-incompatible features now available:** PostgreSQL supports `@@index` with partial indexes, full-text search (`pg_trgm`), and JSONB columns. Consider migrating `techStack String?` (currently JSON stored as a string) to `techStack Json?` using Prisma's `Json` type for native PostgreSQL JSONB.

---

### Phase 2 — Generate and Review Migrations

```bash
# Point to the new PostgreSQL DATABASE_URL
export DATABASE_URL="postgresql://..."

# Generate migration files from the updated schema
npx prisma migrate dev --name init_postgres --create-only

# Review the generated SQL in prisma/migrations/
# Verify all tables, indexes, and constraints look correct

# Apply
npx prisma migrate dev
```

The generated migration will contain `CREATE TABLE` statements, foreign key constraints, and unique indexes. Review for:
- All foreign key `ON DELETE CASCADE` relationships are correctly emitted.
- `CandidateJob` composite unique index `@@unique([candidateId, jobId])` is emitted as a `UNIQUE` constraint.
- `RefreshToken.token` is indexed (it is `@unique`, so Prisma creates this automatically).

---

### Phase 3 — Seed Data Migration (If Required)

If migrating an existing SQLite database with real user data:

```bash
# Install prisma-import or use a script approach
# Export SQLite data to JSON:
npm install -g @prisma/migrate  # if not already

# Use a custom script to dump and re-seed:
# 1. Query all tables from dev.db
# 2. INSERT into PostgreSQL in dependency order:
#    Users → Jobs → Candidates → CandidateJobs → Interviews → Notes → RefreshTokens
```

**Dependency order for inserts:** `User` must exist before `Job`, `Candidate`, `RefreshToken`. `Job` and `Candidate` must exist before `CandidateJob`. `Candidate` must exist before `Note` and `Interview`.

If starting fresh (no production data to migrate), truncate all tables and re-run the application — `runSeedIfEmpty()` will auto-seed the demo user.

---

### Phase 4 — Application Configuration

**`apps/api/.env` (production — never committed to git):**
```env
DATABASE_URL="postgresql://user:pass@host:5432/recruitapex?sslmode=require"
JWT_ACCESS_SECRET="<256-bit-random-hex>"
JWT_REFRESH_SECRET="<256-bit-random-hex>"
NODE_ENV="production"
FRONTEND_URL="https://yourdomain.com"
PORT=3001
```

**`apps/web` (build-time env):**
```env
VITE_API_URL=/api  # served behind reverse proxy, no change needed
```

---

### Phase 5 — Vite Production Proxy → Nginx Reverse Proxy

In development, Vite proxies `/api` to the Express server. In production, Vite is gone — a reverse proxy (nginx, Caddy, or a cloud load balancer) must handle routing:

**Nginx example:**
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    # Serve React SPA static files
    root /var/www/recruitapex/dist;
    index index.html;

    # SPA fallback — all non-asset routes → index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Express
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cookie_path / "/; SameSite=Strict; Secure";
    }
}
```

This preserves the same-origin request structure — `withCredentials: true` cookies will continue to work correctly.

---

### Phase 6 — Run Prisma Migrations in CI/CD

Add a deploy step before starting the API server:
```bash
# In your deploy script / Dockerfile CMD
npx prisma migrate deploy   # applies pending migrations non-interactively
node dist/index.js           # start the server
```

`prisma migrate deploy` (not `dev`) is the safe production command — it applies existing migration files without generating new ones or resetting data.

---

### Phase 7 — Post-Migration Validation Checklist

- [ ] All tables present in PostgreSQL (`\dt` in psql)
- [ ] Unique constraints enforced (`CandidateJob`: `candidateId + jobId`)
- [ ] Cascade deletes work (delete a Candidate → CandidateJobs, Notes, Interviews removed)
- [ ] JWT auth flow works end-to-end (register → login → refresh → protected endpoint)
- [ ] Pipeline drag-and-drop persists (stage update stored in PostgreSQL)
- [ ] Seed runs on fresh database (`runSeedIfEmpty()` creates demo user)
- [ ] Rate limiting functions correctly under load
- [ ] HTTPS enforced, `secure: true` on refresh token cookie verified
- [ ] Expired `RefreshToken` rows pruning job scheduled (cron or startup sweep)
- [ ] `DATABASE_URL` is not logged anywhere in stdout

---

### Future PostgreSQL-Specific Opportunities

| Feature | Benefit |
|---|---|
| Full-text search (`pg_trgm`) | Replace `LIKE '%search%'` on candidates with indexed `GIN` full-text search |
| JSONB for `techStack` | Native JSON queries instead of `JSON.parse(techStack)` on every response |
| Row-level security (RLS) | Enforce `userId` isolation at the database level (defense in depth) |
| `pg_cron` | Scheduled token pruning + stale record cleanup within PostgreSQL itself |
| Read replicas | Scale read queries (pipeline, dashboard) independently from writes |

---

*End of Report*
