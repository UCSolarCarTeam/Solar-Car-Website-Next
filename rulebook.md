# Code Rulebook
## Solar Car Website - Next.js Application

**Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Purpose:** Single source of truth for all code standards, patterns, and conventions

---

## Table of Contents

1. [Confirmed Tech Stack](#1-confirmed-tech-stack)
2. [System Architecture & Runtime Flow](#2-system-architecture--runtime-flow)
3. [Database & Supabase Rules](#3-database--supabase-rules)
4. [API / tRPC Contract Rules](#4-api--trpc-contract-rules)
5. [Data Contracts](#5-data-contracts)
6. [Frontend & Styling System](#6-frontend--styling-system)
7. [Coding & Contribution Standards](#7-coding--contribution-standards)
8. [AI-Specific Enforcement Rules](#8-ai-specific-enforcement-rules)
9. [Implicit Knowledge Recovery](#9-implicit-knowledge-recovery)

---

## 1. Confirmed Tech Stack

### 1.1 Core Frameworks & Libraries

**DO:** Use these exact versions and frameworks. **DO NOT:** Deviate without team approval.

| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| Next.js | 15.5.9 | React framework | App Router only |
| React | 18.3.1 | UI library | Server & Client components |
| TypeScript | 5.5.3 | Type safety | Strict mode enabled |
| Node.js | ES2022 target | Runtime | Check with `node --version` |

### 1.2 Backend & API

| Technology | Version | Purpose |
|------------|---------|---------|
| tRPC | 11.0.0-rc.446 | Type-safe API layer |
| Prisma | 6.4.1 | ORM & database client |
| Zod | 3.23.3 | Schema validation |
| SuperJSON | 2.2.1 | Data serialization |
| Clerk | 6.12.5 | Authentication |

### 1.3 Database & Storage

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | (via Supabase) | Primary database |
| Supabase | 2.45.4 | Database host & file storage |
| Prisma Client | 6.4.1 | Database client |

### 1.4 Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| Sass/SCSS | 1.79.4 | Styling (SCSS Modules) |

**CRITICAL:** The codebase does NOT use Tailwind CSS. All styling is done via SCSS Modules. Do not add Tailwind classes or configure Tailwind.

### 1.5 Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 8.57.0 | Linting |
| Prettier | 3.3.3 | Code formatting |
| Yarn | 1.22.22 | Package manager |
| TypeScript ESLint | 8.1.0 | TypeScript linting |

### 1.6 Additional Libraries

| Technology | Version | Purpose |
|------------|---------|---------|
| @tanstack/react-query | 5.50.0 | Data fetching & caching |
| @tanstack/react-table | 8.20.5 | Table components |
| Framer Motion | 12.23.22 | Animations |
| React Hot Toast | 2.5.2 | Notifications |
| React Select | 5.8.1 | Select components |
| Browser Image Compression | 2.0.2 | Image optimization |

### 1.7 Build & Deployment

- **Package Manager:** Yarn v1.22.22 (use `corepack enable yarn`)
- **Build Command:** `yarn build`
- **Dev Command:** `yarn dev --turbo` (uses Turbopack)
- **Deployment:** Vercel (automatic from main branch)
- **Post-install:** `prisma generate` runs automatically

### 1.8 Linting & Formatting Setup

**ESLint Configuration:**
- Extends: `next`, `next/core-web-vitals`, `@typescript-eslint/recommended`, `@typescript-eslint/recommended-type-checked`, `@typescript-eslint/stylistic-type-checked`, `prettier`
- Plugins: `@typescript-eslint`, `prettier`, `promise`, `sort-keys`, `sort-destructure-keys`
- **Critical Rules:**
  - `no-console`: error (use `global.console.log` in development only)
  - `@typescript-eslint/consistent-type-imports`: warn (prefer type imports)
  - `sort-keys`: error (object keys must be sorted)
  - `react/jsx-sort-props`: error (props must be sorted)

**Prettier Configuration:**
- Print width: 80
- Single quotes: false (use double quotes)
- Semicolons: true
- Trailing commas: all
- Tab width: 2
- Import order: `@/*` → `@/components/*` → relative imports
- Import separation: true

**DO:** Run `yarn lint` before committing. **DO NOT:** Commit code with linting errors.

### 1.9 Environment Variables

**DO:** Use `@t3-oss/env-nextjs` for environment variable validation.

**Client Variables (NEXT_PUBLIC_*):**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL

**Server Variables:**
- `CLERK_SECRET_KEY`: Clerk secret key
- `DATABASE_URL`: PostgreSQL connection string
- `DIRECT_URL`: Direct database connection (for migrations)
- `NODE_ENV`: `development` | `test` | `production`
- `PROFILE_PICTURE_BUCKET`: Supabase bucket name for profile pictures
- `SPONSORSHIP_PICTURE_BUCKET`: Supabase bucket name for sponsor images
- `WEBHOOK_SECRET`: Clerk webhook secret

**DO:** Validate all env vars in `src/env.js` using Zod schemas.  
**DO NOT:** Access `process.env` directly. Always use `env` from `@/env`.

---

## 2. System Architecture & Runtime Flow

### 2.1 Application Entry Points

**Root Layout:** `src/app/layout.tsx`
- Wraps entire app with `ClerkProvider` and `TRPCReactProvider`
- Loads global SCSS: `@/styles/globals.scss`
- Sets font: Saira (Google Fonts)

**Middleware:** `src/middleware.ts`
- Runs on every request
- Uses Clerk middleware for authentication
- Public routes: `/`, `/recruitment`, `/cars`, `/team`, `/support-us`, `/sponsors`, `/our-work`, `/api/webhooks/*`, specific tRPC endpoints
- Protected routes: Everything else (requires authentication)

### 2.2 Routing Strategy

**Next.js App Router Structure:**
```
src/app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page (/)
├── loading.tsx         # Global loading UI
├── [route]/
│   ├── layout.tsx      # Route-specific layout
│   ├── page.tsx        # Route page component
│   └── index.module.scss # Route-specific styles
```

**DO:** Use App Router conventions. **DO NOT:** Use Pages Router patterns.

**Route Organization:**
- Public pages: `/`, `/recruitment`, `/cars`, `/team`, `/support-us`, `/sponsors`, `/our-work`
- Protected pages: `/portal/*` (requires authentication)
- API routes: `/api/trpc/*`, `/api/upload*`, `/api/webhooks/*`

### 2.3 Request → Response Flow

**Public tRPC Endpoints (fe router):**
1. Request → `src/middleware.ts` (check if public route)
2. → `src/app/api/trpc/[trpc]/route.ts` (HTTP handler)
3. → `src/server/api/trpc.ts` (create context with user, db, clerkClient, supabaseClient)
4. → `src/server/api/routers/fe.ts` (public procedures)
5. → Prisma query → Database
6. → Response (serialized with SuperJSON)

**Protected tRPC Endpoints (portal router):**
1. Request → `src/middleware.ts` (enforce authentication)
2. → `src/app/api/trpc/[trpc]/route.ts`
3. → `src/server/api/trpc.ts` (context with authenticated user)
4. → `src/server/api/routers/portal.ts` (admin middleware checks role)
5. → Prisma query → Database
6. → Response

**File Upload Flow:**
1. Client → `/api/uploadProfilePic` or `/api/uploadSponsorPic`
2. → Convert base64 to Buffer
3. → Upload to Supabase Storage bucket
4. → Return public URL

### 2.4 Frontend ↔ Backend Interaction Model

**Client Components:**
- Use `"use client"` directive
- Import `trpc` from `@/trpc/react`
- Use hooks: `trpc.portal.getDBUsers.useQuery()`, `trpc.portal.updateDBUser.useMutation()`
- Type inference: `RouterOutputs["portal"]["getDBUsers"]`

**Server Components:**
- Use `"use server"` directive (for Server Actions) or no directive (default)
- Import `trpc` from `@/trpc/server`
- Use: `await trpc.fe.getTeamMembers()`
- Wrap with `<HydrateClient>` for React Query hydration

**DO:** Use Server Components by default. **DO NOT:** Add `"use client"` unless you need hooks, event handlers, or browser APIs.

### 2.5 Authentication Flow

1. User visits protected route → Clerk middleware redirects to `/portal/sign-in`
2. User signs in → Clerk creates session
3. Webhook → `/api/webhooks` → Creates/updates user in database
4. User accesses portal → Middleware verifies session
5. tRPC context → `currentUser()` from Clerk
6. Admin routes → Check `user.publicMetadata.role` against `adminClerkRoles`

**User Roles (Clerk publicMetadata.role):**
- `"member"`: Basic authenticated user
- `"admin"`: Full admin access
- `"business"`: Business team admin
- `"mechanicallead"`: Mechanical team lead
- `"electricallead"`: Electrical team lead

---

## 3. Database & Supabase Rules

### 3.1 Schema Structure

**Prisma Schema Location:** `prisma/schema.prisma`

**Datasource:**
- Provider: `postgresql`
- URL: `env("DATABASE_URL")` (connection pooler)
- Direct URL: `env("DIRECT_URL")` (direct connection for migrations)

**DO:** Always use Prisma Client. **DO NOT:** Write raw SQL queries unless absolutely necessary.

### 3.2 Naming Conventions

**Models:**
- PascalCase: `User`, `Timeline`, `Sponsor`, `Recruitment`
- Singular nouns: `User` not `Users`

**Fields:**
- camelCase: `clerkUserId`, `schoolEmail`, `profilePictureUrl`
- Boolean: prefix with `is` or `has` (e.g., `hasImage`)
- Dates: suffix with `At` (e.g., `createdAt`, `updatedAt`, `expiresAt`)

**Enums:**
- PascalCase: `SponsorLevel`, `AllTeamRoles`
- Values: Use `@map()` for database representation (e.g., `@map("Gold")`)

**DO:** Follow Prisma naming conventions. **DO NOT:** Use snake_case or kebab-case for model/field names.

### 3.3 Relationships and Constraints

**Current Models:**
- `User`: Standalone (no foreign keys)
- `Timeline`: Standalone
- `Sponsor`: Standalone
- `Recruitment`: Standalone

**Unique Constraints:**
- `User.clerkUserId`: unique
- `User.schoolEmail`: unique (nullable)
- `Timeline`: `@@unique([year, monthNum])`

**DO:** Add unique constraints for fields that must be unique. **DO NOT:** Create relationships without explicit foreign keys in schema.

### 3.4 Migration Strategy

**Development Migrations:**
```bash
yarn db:migrate-dev  # Creates migration, applies it, generates client
```

**Production Migrations:**
```bash
yarn db:migrate-prod  # Applies pending migrations (deploy script)
```

**Migration Naming:**
- Format: `YYYYMMDDHHMMSS_description`
- Example: `20250125210128_add_recruitment_table`

**DO:**
1. Create migration after schema changes
2. Review generated SQL in `prisma/migrations/*/migration.sql`
3. Test migration locally before deploying
4. Commit migration files with schema changes

**DO NOT:**
1. Edit migration files after creation
2. Delete migration files
3. Use `db:push` in production (use migrations)

**Rollback Strategy:**
- Create new migration to reverse changes
- Or manually edit database (not recommended)

### 3.5 Data Ownership Boundaries

**User Data:**
- Clerk: Authentication, user metadata (`publicMetadata.role`)
- Database: Profile data (firstName, lastName, teamRole, etc.)
- Supabase Storage: Profile pictures

**DO:** Keep Clerk and database in sync via webhooks. **DO NOT:** Store authentication data in database.

**File Storage:**
- Profile pictures: `PROFILE_PICTURE_BUCKET`
- Sponsor logos: `SPONSORSHIP_PICTURE_BUCKET`
- Timeline images: Stored in Supabase (bucket TBD)

**DO:** Use Supabase Storage for all file uploads. **DO NOT:** Store files in public folder or commit to git.

### 3.6 Database Client Usage

**Import:** `import { db } from "@/server/db"`

**DO:**
- Use Prisma Client for all queries
- Use transactions for multi-step operations
- Handle errors with try/catch
- Use `select` to limit returned fields

**DO NOT:**
- Create multiple Prisma Client instances (use singleton)
- Access database from client components (use tRPC)
- Use `findMany()` without `where` on large tables (add pagination)

**Example:**
```typescript
const users = await ctx.db.user.findMany({
  where: { teamRole: { not: null } },
  select: { id: true, firstName: true, lastName: true },
  orderBy: { id: "desc" },
});
```

---

## 4. API / tRPC Contract Rules

### 4.1 Router Organization

**Router Structure:**
```
src/server/api/
├── root.ts              # Main router (combines all routers)
├── trpc.ts              # tRPC setup, context, procedures
└── routers/
    ├── fe.ts            # Public frontend endpoints
    └── portal.ts        # Protected admin endpoints
```

**DO:** Add new routers in `routers/` and register in `root.ts`. **DO NOT:** Create routers outside this structure.

### 4.2 Procedure Naming

**Query Procedures (read data):**
- Prefix: `get` (e.g., `getTeamMembers`, `getSponsorsList`)
- Pattern: `get[Entity][Filter]?` (e.g., `getDBUsers`, `getCurrentDBUser`)

**Mutation Procedures (write data):**
- Prefix: `create`, `update`, `delete` (e.g., `createSponsor`, `updateDBUser`, `deleteOurWorkEntry`)
- Pattern: `[action][Entity]` (e.g., `createRecruitmentForm`)

**DO:** Use consistent naming. **DO NOT:** Mix naming patterns (e.g., `fetchUsers` vs `getUsers`).

### 4.3 Zod Schema Patterns

**Input Validation:**
- Define schemas inline with `.input()` or import from shared file
- Use Zod primitives: `z.string()`, `z.number()`, `z.boolean()`, `z.enum()`, `z.nativeEnum()`
- Nullable fields: `.nullable()` or `.optional().or(z.literal(""))`
- Custom validation: `.refine()`, `.regex()`

**DO:**
```typescript
.input(
  z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    age: z.number().int().min(0).max(120),
    role: z.nativeEnum(AllTeamRoles).nullable(),
  })
)
```

**DO NOT:**
- Skip input validation
- Use `z.any()` or `z.unknown()` without good reason
- Validate on client only (always validate on server)

### 4.4 Error Handling and Auth Enforcement

**Procedure Types:**
- `publicProcedure`: No auth required (public data)
- `authedProcedure`: Requires authentication (user must be logged in)
- `adminMiddleware`: Requires admin role (checks `publicMetadata.role`)

**DO:**
```typescript
export const portalRouter = createTRPCRouter({
  getData: publicProcedure.query(async ({ ctx }) => {
    // Public access
  }),
  
  updateProfile: authedProcedure
    .input(z.object({ ... }))
    .mutation(async ({ ctx }) => {
      // Requires auth
    }),
  
  deleteUser: adminMiddleware
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx }) => {
      // Requires admin role
    }),
});
```

**Error Handling:**
- Wrap database operations in try/catch
- Throw `TRPCError` with appropriate code:
  - `UNAUTHORIZED`: User not authenticated or lacks permission
  - `BAD_REQUEST`: Invalid input
  - `NOT_FOUND`: Resource doesn't exist
  - `CONFLICT`: Duplicate resource
  - `INTERNAL_SERVER_ERROR`: Unexpected error

**DO:**
```typescript
try {
  await ctx.db.user.create({ data: input });
  return true;
} catch (error) {
  throw new TRPCError({
    cause: error,
    code: "INTERNAL_SERVER_ERROR",
  });
}
```

**DO NOT:**
- Return error objects directly
- Expose database error messages to client
- Skip error handling

### 4.5 What is Allowed vs Forbidden in Procedures

**ALLOWED:**
- Database queries (Prisma)
- Clerk API calls (via `ctx.clerkClient`)
- Supabase Storage operations (via `ctx.supabaseClient`)
- Data transformation and validation
- Business logic

**FORBIDDEN:**
- Direct file system access (use Supabase Storage)
- External API calls without error handling
- Long-running operations (use background jobs)
- Mutations in query procedures
- Bypassing authentication checks

**DO:** Keep procedures focused and single-purpose. **DO NOT:** Create "god procedures" that do multiple unrelated things.

---

## 5. Data Contracts

### 5.1 Canonical Shapes for All Entities

**User Entity:**
```typescript
type User = {
  id: number;
  clerkUserId: string; // unique
  ucid: string | null; // 8 digits, optional
  schoolEmail: string | null; // @ucalgary.ca, unique, optional
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  fieldOfStudy: string | null; // max 100 chars
  schoolYear: string | null; // max 50 chars
  yearJoined: string | null; // YYYY format, 2000-currentYear+1
  profilePictureUrl: string | null; // Supabase Storage URL
  description: string | null; // max 250 chars
  teamRole: AllTeamRoles | null;
  linkedIn: string | null; // LinkedIn profile URL
};
```

**Timeline Entity:**
```typescript
type Timeline = {
  id: number;
  year: number;
  monthNum: number; // 1-12
  monthName: string; // "January", "February", etc.
  description: string | null;
  imageUrl: string | null; // Supabase Storage URL
  createdAt: Date;
  updatedAt: Date;
};
// Unique constraint: [year, monthNum]
```

**Sponsor Entity:**
```typescript
type Sponsor = {
  id: number;
  name: string;
  logoUrl: string; // Supabase Storage URL, required
  websiteUrl: string; // required
  description: string | null;
  sponsorLevel: SponsorLevel; // "Gold" | "Silver" | "Bronze" | "Friends"
};
```

**Recruitment Entity:**
```typescript
type Recruitment = {
  id: number;
  header: string;
  description: string;
  link: string;
  expiresAt: Date; // Used to filter active forms
};
```

### 5.2 Explicit Definition of fieldOfStudy Inputs and Variants

**Current Implementation:**
- Type: `string | null`
- Max length: 100 characters
- Validation: Optional field, no enum restriction
- Storage: Free-form text in database

**DO:** Allow any string value (users can enter their field of study freely).  
**DO NOT:** Create an enum or restrict to predefined values (unless business requirement changes).

**Validation Rules:**
- Optional: Can be empty string or null
- Max length: 100 characters (enforced by Zod)
- No format restrictions (e.g., "Computer Science", "Mechanical Engineering", "Business")

### 5.3 Required, Optional, Nullable Rules

**Required Fields (non-nullable, non-optional):**
- `User.clerkUserId`: Always required (unique identifier)
- `Timeline.year`, `Timeline.monthNum`, `Timeline.monthName`: Required
- `Sponsor.name`, `Sponsor.logoUrl`, `Sponsor.websiteUrl`, `Sponsor.sponsorLevel`: Required
- `Recruitment.header`, `Recruitment.description`, `Recruitment.link`, `Recruitment.expiresAt`: Required

**Optional/Nullable Fields:**
- Most `User` fields are nullable (profile can be incomplete)
- `Timeline.description`, `Timeline.imageUrl`: Nullable
- `Sponsor.description`: Nullable

**DO:** Use `z.string().nullable()` for fields that can be null in database.  
**DO:** Use `.optional().or(z.literal(""))` for fields that accept empty strings.  
**DO NOT:** Mix nullable and optional without understanding the difference.

**Update Mutations:**
- Use `z.string().nullable()` for partial updates
- Filter out `null` values before updating (only update provided fields)
- Example pattern from `updateOurWorkEntry`:
```typescript
const filteredUpdateData = Object.fromEntries(
  Object.entries(updateData).filter(([_, value]) => value !== null)
);
```

### 5.4 Validation Edge Cases

**User Form Validation (`src/app/_lib/userValidation.ts`):**

**UCID:**
- Format: Exactly 8 digits
- Optional: Can be null or empty
- Validation: `/^\d{8}$/`

**School Email:**
- Format: Valid email ending in `@ucalgary.ca`
- Optional: Can be null or empty
- Validation: Email regex + `/@ucalgary\.ca$/i`

**Phone Number:**
- Format: `+?[\d\s()-]{10,}` (allows international format)
- Length: 10-20 characters
- Optional: Can be null or empty

**LinkedIn:**
- Format: `https://(www.)?linkedin.com/in/[username]/?`
- Optional: Can be null or empty
- Validation: Strict URL pattern

**Year Joined:**
- Format: YYYY (4 digits)
- Range: 2000 to currentYear + 1
- Optional: Can be null or empty

**Description:**
- Max length: 250 characters
- Optional: Can be null or empty

**DO:** Use the validation functions from `@/app/_lib/userValidation.ts`. **DO NOT:** Create duplicate validation logic.

---

## 6. Frontend & Styling System

### 6.1 How SCSS and Tailwind Coexist

**CRITICAL:** Tailwind CSS is **NOT USED** in this codebase. Despite the constraint mentioning "SCSS + Tailwind (hybrid)", the codebase uses **SCSS Modules exclusively**.

**DO:** Use SCSS Modules for all styling. **DO NOT:** Add Tailwind classes, configure Tailwind, or install Tailwind dependencies.

### 6.2 When to Use Utility Classes vs SCSS

**SCSS Modules Pattern:**
- Each component has its own `index.module.scss` file
- Import: `import styles from "./index.module.scss"`
- Usage: `className={styles.className}`
- Scoped: Classes are automatically scoped to component

**DO:**
```tsx
import styles from "./Component.module.scss";

<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
</div>
```

**DO NOT:**
- Use global CSS classes (except from `globals.scss`)
- Use inline styles (except for dynamic values like `style={{ objectFit: "cover" }}`)
- Use Tailwind utility classes

### 6.3 Shared Components vs Page-Specific Styles

**Component Styles:**
- Location: `src/app/_components/[ComponentName]/index.module.scss`
- Example: `src/app/_components/Buttons/index.module.scss`
- Scoped to component only

**Page Styles:**
- Location: `src/app/[route]/index.module.scss`
- Example: `src/app/team/index.module.scss`
- Scoped to page only

**Global Styles:**
- Location: `src/styles/globals.scss`
- Contains: CSS variables, reset styles, global rules
- Imported in `src/app/layout.tsx`

**DO:**
- Keep component styles in component folder
- Keep page styles in page folder
- Use global styles only for app-wide rules

**DO NOT:**
- Share styles between components via global classes (use composition instead)
- Put page-specific styles in component files

### 6.4 Design Tokens

**CSS Variables (defined in `globals.scss`):**
```scss
:root {
  --primary-helios: #b94a6c;
  --primary-red: #9c0534;
  --secondary-red: #bf1c1c;
}
```

**DO:** Use CSS variables for colors. **DO NOT:** Hardcode color values.

**Spacing:**
- No standardized spacing scale (use rem/px as needed)
- Common patterns: `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`

**Typography:**
- Font: Saira (Google Fonts, loaded in root layout)
- Sizes: Use rem units (e.g., `1rem`, `1.2em`, `2.5em`)

**Colors:**
- Background: `#121212` (dark theme)
- Text: `white` (on dark background)
- Primary: `var(--primary-helios)`, `var(--primary-red)`

**DO:** Follow existing color and spacing patterns. **DO NOT:** Introduce new color variables without team approval.

### 6.5 Patterns Used Across Existing Pages

**Common Page Structure:**
```tsx
<main className={styles.main}>
  <Navbar />
  <div className={styles.container}>
    {/* Page content */}
  </div>
</main>
<Footer />
```

**Loading States:**
- Use `<Loader isLoading={isFetching} />` component
- Show loader while data is fetching

**Image Handling:**
- Use Next.js `Image` component
- `fill` prop for background images
- `objectFit: "cover"` for full coverage
- `placeholder="blur"` for optimized loading
- `priority` for above-the-fold images

**DO:** Follow these patterns for consistency. **DO NOT:** Create new page structures without reviewing existing pages.

### 6.6 SCSS Module Best Practices

**Naming:**
- Use camelCase: `.container`, `.teamMemberImage`, `.textFieldInput`
- Use BEM-like patterns for modifiers: `.modalOverlay`, `.modal.open`, `.modal.closed`

**Nesting:**
- Use SCSS nesting (max 3-4 levels deep)
- Use `&` for pseudo-classes and modifiers

**DO:**
```scss
.container {
  display: flex;
  flex-direction: column;
  
  &.open {
    opacity: 1;
  }
  
  .title {
    font-size: 2rem;
  }
}
```

**DO NOT:**
- Nest deeper than 4 levels
- Use `!important` (except for overrides like `#backsplashImage`)
- Create overly specific selectors

---

## 7. Coding & Contribution Standards

### 7.1 Folder Structure Rules

**DO:** Follow this exact structure:

```
src/
├── app/                          # Next.js App Router
│   ├── _components/              # Shared components
│   │   ├── [ComponentName]/
│   │   │   ├── index.tsx
│   │   │   └── index.module.scss
│   ├── _hooks/                   # Custom React hooks
│   ├── _lib/                     # Utility functions
│   ├── _types/                   # TypeScript type definitions
│   ├── api/                      # API routes
│   │   ├── trpc/[trpc]/route.ts
│   │   └── [route]/route.ts
│   ├── [route]/                  # Pages/routes
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── index.module.scss
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── server/                       # Server-side code
│   ├── api/
│   │   ├── root.ts               # tRPC root router
│   │   ├── trpc.ts               # tRPC setup
│   │   └── routers/              # tRPC routers
│   ├── db.ts                     # Prisma client
│   └── supabase.ts               # Supabase client
├── styles/
│   └── globals.scss              # Global styles
└── trpc/                         # tRPC client setup
    ├── react.tsx
    ├── server.ts
    └── query-client.ts
```

**DO NOT:**
- Create files outside this structure
- Use `components/` instead of `_components/`
- Put server code in `app/` directory (except API routes)

### 7.2 Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `BasicButton.tsx`)
- Pages: `page.tsx`, `layout.tsx` (Next.js convention)
- Styles: `index.module.scss` (co-located with component)
- Utilities: `camelCase.ts` (e.g., `userValidation.ts`)
- Types: `index.ts` (in `_types/` folder)

**Components:**
- PascalCase: `InlineUserPopup`, `TeamMember`, `Navbar`
- Export default: `export default memo(Component)`
- Use `memo()` for performance optimization

**Variables:**
- camelCase: `teamMembers`, `isLoading`, `validationErrors`
- Constants: UPPER_SNAKE_CASE: `MAX_DESCRIPTION_LENGTH`

**Functions:**
- camelCase: `handleSave`, `onInputChange`, `validateUserForm`
- Async functions: Use `async/await`, not `.then()`

**DO:** Follow these conventions consistently. **DO NOT:** Mix naming styles.

### 7.3 Ticket → Branch → PR → Merge Workflow

**Branch Naming:**
- Format: `TEL-XXX-description` (e.g., `TEL-900-fix-user-validation`)
- Use ticket number prefix
- Use kebab-case for description

**DO:**
1. Create branch from `main`: `git checkout -b TEL-XXX-description`
2. Make changes, commit with descriptive messages
3. Run `yarn lint` and fix any errors
4. Push branch: `git push origin TEL-XXX-description`
5. Create Pull Request (PR) on GitHub
6. Request review from team member
7. Address review comments
8. Rebase from main before merging: `git rebase main`
9. Merge PR (squash and merge recommended)

**DO NOT:**
- Commit directly to `main`
- Merge without review
- Skip linting
- Force push to shared branches

**Commit Messages:**
- Format: `TEL-XXX: Description of change`
- Be descriptive: "Add user validation" not "Fix bug"
- Use present tense: "Add" not "Added"

### 7.4 Refactor vs Rewrite Decision Rules

**Refactor When:**
- Code works but needs improvement (performance, readability, structure)
- Adding features to existing code
- Fixing bugs in existing patterns
- Small to medium scope changes

**Rewrite When:**
- Current implementation is fundamentally broken
- Technology stack change required
- Complete feature replacement
- Team consensus and ticket approval required

**DO:** Prefer refactoring over rewriting. **DO NOT:** Rewrite without team discussion and ticket approval.

### 7.5 Documentation Requirements

**Code Comments:**
- Explain "why", not "what" (code should be self-documenting)
- Use JSDoc for function documentation
- Comment complex business logic

**DO:**
```typescript
/**
 * Validates user form data and returns validation errors.
 * Uses Zod schema to ensure data integrity before database operations.
 */
export function validateUserForm(data: Partial<UserFormData>): UserFormErrors {
  // Implementation
}
```

**DO NOT:**
- Comment obvious code: `// Set loading to true`
- Leave TODO comments without ticket reference
- Document implementation details that change frequently

**README Updates:**
- Update README when adding new setup steps
- Document new environment variables
- Update deployment instructions if changed

---

## 8. AI-Specific Enforcement Rules

### 8.1 Mandatory Order of Operations Before Editing Code

**AI agents MUST follow this sequence:**

1. **Read the Rulebook:** Review this entire document
2. **Understand Context:** Read relevant files to understand current implementation
3. **Identify Patterns:** Match existing code patterns (naming, structure, style)
4. **Propose Changes:** Explain what will change and why
5. **Verify Dependencies:** Check if changes affect other files
6. **Apply Changes:** Make edits following established patterns
7. **Check Linting:** Verify no linting errors introduced
8. **Test Logic:** Ensure changes maintain existing functionality

**DO:** Follow this sequence for every code change. **DO NOT:** Skip steps or make assumptions.

### 8.2 Files AI Must Never Modify

**CRITICAL - DO NOT MODIFY:**
- `package.json` (without explicit user request)
- `yarn.lock` (managed by Yarn)
- `prisma/migrations/*` (historical, immutable)
- `.gitignore` (unless adding new ignore patterns)
- `next.config.js` (unless configuration change needed)
- `tsconfig.json` (unless TypeScript config change needed)
- `.eslintrc.cjs`, `.prettierrc.cjs` (unless linting rule change needed)
- `src/env.js` (unless adding new env var)

**DO:** Ask user before modifying configuration files. **DO NOT:** Modify these files without explicit permission.

### 8.3 How AI Should Propose, Explain, and Apply Changes

**Proposal Format:**
1. **What:** Brief description of change
2. **Why:** Reason for change (bug fix, feature, refactor)
3. **Where:** Files that will be modified
4. **How:** Approach to implementation
5. **Impact:** What might break or need updating

**Example:**
```
I will add validation for the UCID field in the user form.

**What:** Add regex validation to ensure UCID is exactly 8 digits
**Why:** Currently UCID accepts any string, but it should be 8 digits
**Where:** 
  - src/app/_lib/userValidation.ts (add validation rule)
  - src/app/_components/PortalComponents/EditUserCell/InlineUserPopup.tsx (display error)
**How:** Update Zod schema with regex pattern /^\d{8}$/
**Impact:** Existing users with invalid UCID will see validation errors
```

**DO:** Provide clear explanations. **DO NOT:** Make changes without explaining first (unless user explicitly requests immediate changes).

### 8.4 How AI Should Handle Uncertainty

**When Uncertain:**
1. **Ask for Clarification:** Don't guess user intent
2. **Show Examples:** Provide options if multiple interpretations exist
3. **Reference Rulebook:** Point to relevant section
4. **Suggest Investigation:** Propose reading specific files to understand context

**DO:**
- Ask: "Should I use SCSS modules or create a new component for this styling?"
- Show options: "I can implement this as (A) a new tRPC procedure or (B) an API route. Which do you prefer?"
- Reference: "According to section 4.2, procedure names should use 'get' prefix for queries."

**DO NOT:**
- Make assumptions about user intent
- Choose arbitrary implementations
- Skip validation or error handling "to save time"

### 8.5 Code Change Application Rules

**When Applying Changes:**
1. **Preserve Existing Patterns:** Match code style, naming, structure
2. **Maintain Type Safety:** Don't use `any` or skip type definitions
3. **Add Error Handling:** Wrap database/API calls in try/catch
4. **Update Related Files:** If changing a type, update all usages
5. **Run Linter:** Check for linting errors after changes

**DO:**
- Use existing patterns (e.g., `validateUserForm` pattern for new validation)
- Match naming conventions (e.g., `get[Entity]` for queries)
- Follow error handling patterns (try/catch with TRPCError)

**DO NOT:**
- Introduce new patterns without justification
- Break existing type definitions
- Skip error handling
- Leave unused imports or variables

---

## 9. Implicit Knowledge Recovery

### 9.1 Undocumented Assumptions

**Discovered Implicit Rules:**

1. **Component Memoization:**
   - All components exported with `memo()` wrapper
   - Assumption: Performance optimization for re-renders
   - **Rule:** Always wrap component exports with `memo()`

2. **Image Loading Pattern:**
   - Pages show `<Loader>` while images load
   - Use `onLoad` callback to hide loader
   - **Rule:** Always handle image loading states

3. **tRPC Error Messages:**
   - Generic error messages shown to users
   - Specific errors logged to console in development
   - **Rule:** Don't expose internal error details to users

4. **Update Mutations:**
   - Filter out `null` values before updating (partial updates)
   - Only update fields that are provided (non-null)
   - **Rule:** Use filtered update pattern for nullable fields

5. **Team Role Assignment:**
   - Only admins can assign Manager/Lead roles
   - Checked in `updateDBUser` mutation
   - **Rule:** Enforce role assignment permissions in mutations

6. **Public vs Protected Routes:**
   - Public tRPC endpoints in `fe` router
   - Protected endpoints in `portal` router
   - **Rule:** Separate routers by access level

7. **File Upload Flow:**
   - Compress images before upload (using `browser-image-compression`)
   - Convert to base64, then to Buffer on server
   - Upload to Supabase Storage, return public URL
   - **Rule:** Always compress images before upload

8. **Session Storage:**
   - Portal uses `useSessionStorage` hook for navigation state
   - Persists current page selection across refreshes
   - **Rule:** Use session storage for temporary UI state

### 9.2 Hidden Coupling or Conventions

**Discovered Couplings:**

1. **Clerk ↔ Database Sync:**
   - Webhook creates user in database when Clerk user signs up
   - `clerkUserId` links Clerk user to database user
   - **Rule:** Never create database user without corresponding Clerk user

2. **Team Role ↔ Clerk Role:**
   - Team roles (AllTeamRoles) stored in database
   - Clerk roles (UserRole) stored in Clerk publicMetadata
   - Different systems, must be kept in sync manually
   - **Rule:** Understand difference between team roles and Clerk roles

3. **Image URLs:**
   - Profile pictures: Supabase Storage URLs
   - Timeline images: Supabase Storage URLs
   - Sponsor logos: Supabase Storage URLs
   - All stored in database as strings
   - **Rule:** Always use Supabase Storage for images, never local files

4. **Recruitment Expiration:**
   - `expiresAt` field used to filter active forms
   - Frontend query filters: `expiresAt >= new Date()`
   - **Rule:** Always filter recruitment forms by expiration date

5. **Timeline Grouping:**
   - Timeline entries grouped by year on frontend
   - Database stores individual month entries
   - Frontend transforms: `reduce()` to group by year
   - **Rule:** Understand data transformation happens in tRPC procedures

### 9.3 Things Everyone Assumes But Never Wrote Down

**Implicit Conventions:**

1. **Component File Structure:**
   - Every component folder has `index.tsx` and `index.module.scss`
   - No other file naming patterns used
   - **Rule:** Always use `index.tsx` for component files

2. **Import Order:**
   - Prettier automatically sorts imports
   - Order: `@/*` → `@/components/*` → relative imports
   - **Rule:** Let Prettier handle import sorting

3. **Type Exports:**
   - Types defined in `src/app/_types/index.ts`
   - Imported as: `import { TypeName } from "@/app/_types"`
   - **Rule:** Centralize shared types in `_types/index.ts`

4. **tRPC Type Inference:**
   - Use `RouterOutputs` and `RouterInputs` from `@/trpc/react`
   - Example: `type User = RouterOutputs["portal"]["getCurrentDBUser"]`
   - **Rule:** Always use type inference, never redefine types manually

5. **Error Toast Messages:**
   - Use `react-hot-toast` for user notifications
   - Pattern: `toast.error("User-friendly message")`
   - Generic messages: "Please contact Telemetry Team"
   - **Rule:** Always show user-friendly error messages

6. **Loading States:**
   - Use `isFetching` from React Query for loading states
   - Show `<Loader>` component while loading
   - **Rule:** Always handle loading states in data fetching

7. **Form Validation:**
   - Validate on client (Zod) before submission
   - Validate on server (Zod in tRPC) for security
   - Show errors inline below form fields
   - **Rule:** Validate on both client and server

8. **Database Query Patterns:**
   - Use `select` to limit returned fields
   - Use `orderBy` for consistent sorting
   - Use `where` for filtering
   - **Rule:** Always be explicit about what data you're fetching

9. **Component Props:**
   - Use TypeScript interfaces for props
   - Destructure props in function parameters
   - **Rule:** Always type component props explicitly

10. **State Management:**
    - Use React hooks (`useState`, `useCallback`, `useMemo`)
    - Use React Query for server state
    - No global state management library (Redux, Zustand, etc.)
    - **Rule:** Use React Query + local state, no global state needed

---

## Appendix: Quick Reference

### Common Commands

```bash
# Development
yarn dev                    # Start dev server with Turbopack
yarn build                  # Build for production
yarn lint                   # Run ESLint

# Database
yarn db:generate            # Generate Prisma Client
yarn db:migrate-dev         # Create and apply migration (dev)
yarn db:migrate-prod        # Apply migrations (production)
yarn db:studio              # Open Prisma Studio
yarn db:push                # Push schema changes (dev only)

# Package Management
yarn install                # Install dependencies
corepack enable yarn        # Enable Yarn v4 (first time setup)
```

### File Path Aliases

- `@/*` → `src/*`
- Use `@/components`, `@/lib`, `@/types`, etc. in imports

### Critical DOs and DON'Ts Summary

**DO:**
- Use SCSS Modules for styling
- Validate with Zod on client and server
- Use tRPC for all API calls
- Follow existing naming conventions
- Handle errors with try/catch
- Use Prisma Client for database queries
- Compress images before upload
- Run linter before committing

**DON'T:**
- Use Tailwind CSS
- Skip input validation
- Access database from client components
- Modify migration files
- Commit linting errors
- Use `any` types
- Store files in public folder
- Create duplicate validation logic

---

**End of Rulebook**

*This rulebook is a living document. Update it when patterns change or new conventions are established.*
