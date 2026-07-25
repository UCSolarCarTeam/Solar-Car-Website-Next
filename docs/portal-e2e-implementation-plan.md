# Portal E2E implementation plan

## Objective

Add a reliable Playwright end-to-end suite for the authenticated portal. The initial release will exercise Recruitment CRUD through the real UI and run on every trusted pull request using a fresh PostgreSQL database in GitHub Actions.

## Chosen architecture

```text
GitHub Actions (public repository; standard Ubuntu runner)
├── PostgreSQL 15 service container
├── Prisma generate + migrate deploy
├── Next.js application started by Playwright
└── Playwright Chromium
    └── Clerk development test administrator
```

The database is job-scoped and destroyed with the runner. Tests must never connect to the production database, production Clerk application, or production Supabase storage.

## Proof of concept — required before full implementation

The POC validates the four uncertain integrations before the team invests in broad portal coverage:

1. GitHub Actions can start the application and a temporary PostgreSQL 15 database together.
2. Prisma migrations work against an empty job-scoped database.
3. Clerk's Playwright helper can sign in a dedicated development administrator.
4. A browser test can make and remove one Recruitment record through the real portal UI.

### POC boundaries

The POC is intentionally small. It should contain one Chromium project, one manually dispatched GitHub Actions workflow, and two tests:

| Test | What it proves |
| --- | --- |
| Signed-in administrator opens `/portal/recruitment` | Clerk authentication, role metadata, portal authorization, and application startup work together. |
| Administrator creates a uniquely named Recruitment record and deletes it | The rendered UI, server action, Prisma, temporary PostgreSQL database, and confirmation dialog work end to end. |

The POC does **not** need an update flow, a required PR check, cross-browser testing, retries, Vercel previews, Supabase uploads, or Clerk invitation coverage. It should be launched with `workflow_dispatch` and run locally before being connected to normal pull-request triggers.

### POC deliverables

- Playwright and Clerk testing dependencies.
- Minimal `playwright.config.ts` with Chromium and a local Next.js web server.
- One authentication setup file that stores test state only in ignored Playwright output.
- One `portal-poc.spec.ts` file containing the two tests above.
- One `.github/workflows/portal-e2e-poc.yml` workflow with Postgres 15, migrations, and manual dispatch.
- Failure-only HTML report and trace artifacts with short retention.
- A short README note listing the required GitHub secrets and local command.

### POC success criteria and decision gate

The POC is successful when all of the following are true:

- [ ] The workflow starts from a manual dispatch and completes on a standard public-repository GitHub runner.
- [ ] The test database starts empty and is discarded after the job.
- [ ] Prisma migrations complete without using a production or shared database URL.
- [ ] The Clerk development administrator reaches `/portal/recruitment`.
- [ ] The Recruitment record is visible after creation and absent after deletion.
- [ ] A forced failure produces a useful trace or HTML report.
- [ ] The workflow completes consistently across three consecutive runs.

If any criterion fails, stop expansion and resolve that integration first. Only after this gate passes should the team add update coverage, normal PR triggers, retries, and the broader portal suite.

## Scope

### In scope for the full initial implementation

- Playwright configuration and Chromium-only execution.
- Clerk-assisted administrator sign-in using a dedicated development account.
- A Postgres 15 service container in a GitHub Actions workflow.
- Prisma generation and migration deployment against the temporary database.
- Portal authentication and authorization smoke tests.
- One full Recruitment CRUD test: create, read, update, and delete.
- Failure artifacts: Playwright HTML report, trace, screenshot, and video.

### Deferred

- Supabase image uploads.
- Clerk invitations, Clerk user deletion, and any other externally destructive identity operations.
- Cross-browser coverage.
- Parallel workers and sharding.
- Vercel preview-deployment testing.
- Replacing Clerk, Supabase, Vercel, or the project database architecture.

## Prerequisites and decisions

### 1. Normalize the package manager

The project uses Yarn 4.18.0 through Corepack with the `node-modules` linker. Keep `packageManager`, `.yarnrc.yml`, the lockfile, README, and CI setup aligned. The E2E workflow must enable Corepack and use immutable installation.

### 2. Create a Clerk development test application

Create a separate Clerk **development** application specifically for browser tests. Create one permanent user and assign an existing portal administrator role through `publicMetadata.role`.

Required GitHub repository secrets:

| Secret | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Loads the Clerk frontend in the test app. |
| `CLERK_SECRET_KEY` | Lets Clerk's Playwright helper establish a test session. |
| `E2E_ADMIN_EMAIL` | Identifies the dedicated administrator account. |

The current environment schema also expects Supabase, webhook, bucket, and flag values. Supply non-production test values only where the application requires a value during startup. Do not enable image-upload tests until a dedicated test storage bucket and cleanup policy exist.

### 3. Protect test credentials

- Never commit `.env` files, browser storage state, test passwords, or Clerk keys.
- Run the authenticated workflow only for trusted repository branches and pull requests. Forked pull requests do not receive secrets.
- Do not use `pull_request_target` to expose secrets to untrusted pull-request code.
- Keep the Clerk test application free of production users and meaningful data.

## Planned repository changes

| Area | Planned change |
| --- | --- |
| `package.json` and lockfile | Add `@playwright/test` and `@clerk/testing`; add `test:e2e`, `test:e2e:ui`, and `test:e2e:ci` scripts. |
| `playwright.config.ts` | Configure Chromium, `baseURL`, a Next.js `webServer`, one CI worker, retries, traces, screenshots, video, and HTML reporting. |
| `tests/e2e/setup.ts` | Sign in with the Clerk test administrator and save temporary test storage state. |
| `tests/e2e/portal/auth.spec.ts` | Verify protected portal routes redirect while signed out and load for an administrator. |
| `tests/e2e/portal/recruitment.spec.ts` | Verify Recruitment create, read, update, and delete through the UI. |
| `.github/workflows/portal-e2e.yml` | Start Postgres, apply migrations, install the browser, run E2E tests, and upload failure artifacts. |
| `.gitignore` | Ignore Playwright output and temporary authentication state if not already ignored. |
| README or testing documentation | Document local prerequisites, commands, secrets, and debugging steps. |

## Phase 1 — POC foundation

### Dependencies

Add Playwright and Clerk's Playwright testing package as development dependencies. Pin or lock versions through the project lockfile. Playwright’s installed browser version must match the test package version.

### Playwright configuration

Create `playwright.config.ts` with these POC policies:

- Run Chromium only.
- Use one worker in CI; CRUD tests mutate shared application state.
- Do not add retries during the POC; fix any first-run instability directly.
- Start the application with Playwright `webServer` rather than requiring a manually started server.
- Reuse a manually running local server when not in CI.
- Capture a trace on failure.
- Capture screenshot and video only on failure.
- Output the HTML report to `playwright-report/` and raw test data to `test-results/`.

Use `http://127.0.0.1:3000` as the initial base URL. Do not test a Vercel preview in this phase.

### Authentication setup

Use Clerk's Playwright helper rather than filling the sign-in UI:

1. Open a public route that loads Clerk.
2. Establish a test session for `E2E_ADMIN_EMAIL`.
3. Save storage state to a Playwright output directory, never to a tracked file.
4. Configure authenticated portal projects to use that state.

The test administrator must have a role recognized by the portal’s existing `adminClerkRoles` guard. Validate this before writing CRUD tests.

### Environment strategy

CI must set:

```text
NODE_ENV=test
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5432/portal_e2e
DIRECT_URL=postgresql://postgres:password@127.0.0.1:5432/portal_e2e
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<GitHub secret>
CLERK_SECRET_KEY=<GitHub secret>
E2E_ADMIN_EMAIL=<GitHub secret>
```

Set any remaining required runtime variables to dedicated non-production values. Prefer valid dummy URLs and dedicated bucket names over bypassing environment validation globally.

## Phase 2 — POC workflow

Create `.github/workflows/portal-e2e-poc.yml`.

### POC trigger

- `workflow_dispatch` for manual investigation.

Do not add `pull_request` or `push` triggers until the POC success criteria are met.

### Job outline

1. Run on `ubuntu-latest` using a standard GitHub-hosted runner.
2. Start a `postgres:15` service container with a database health check.
3. Check out the revision.
4. Set up the selected Node and Yarn version.
5. Install locked dependencies.
6. Run `prisma generate` and `prisma migrate deploy` using the service database URLs.
7. Install the Playwright Chromium browser and its Linux dependencies.
8. Run `yarn test:e2e:ci`.
9. Upload `playwright-report/` and `test-results/` only when the test job fails.

Set artifact retention to five to seven days. The public repository receives free use of standard GitHub-hosted runners; the job should not request a larger runner.

## Phase 3 — POC tests

### Authentication and access test

Create a test that verifies:

1. A signed-out visit to `/portal/recruitment` redirects to the Clerk sign-in route.
2. A signed-in administrator can open `/portal/recruitment`.
3. The Recruitment table and its primary controls are visible.

### Recruitment create-and-delete test

Use an identifier such as `E2E Recruitment <timestamp>-<random suffix>` to ensure every run creates unique data.

1. Navigate to `/portal/recruitment` as the administrator.
2. Activate the control labelled `Add recruitment form`.
3. Fill Header, Description, Link, and Expires At.
4. Save and assert the creation success toast and newly created table row.
5. Open Delete on that row, confirm deletion, and assert the deletion success toast and absence of the row.

Use role, label, heading, and button-name locators. Do not use CSS module class names or positional selectors. Scope Edit and Delete interactions to the unique table row so unrelated data cannot be changed.

### Cleanup

The temporary CI database is automatically discarded. For local runs, perform the deletion through the UI and add defensive `afterEach` cleanup if a test can fail before its delete step. The suite must not use the existing Faker seed because its safety guard only accepts the developer-local database URL.

## Phase 4 — Promote the POC to the full suite

After the POC passes its decision gate:

1. Rename the workflow to `portal-e2e.yml` and add trusted `pull_request` and default-branch `push` triggers.
2. Add two CI retries, trace-on-first-retry behaviour, and the final artifact policy.
3. Split the POC test into focused authentication and Recruitment CRUD specs.
4. Add the Recruitment update assertion.
5. Make the workflow a required pull-request check after several stable runs.

## Phase 5 — Quality gates

Before marking the first implementation complete:

- [ ] `yarn test:e2e` runs locally against a local temporary or dedicated test Postgres database.
- [ ] `yarn test:e2e:ci` works with only CI environment variables and no manually running server.
- [ ] Prisma migrations apply successfully to an empty Postgres 15 database.
- [ ] Signed-out protection is verified.
- [ ] Administrator access is verified.
- [ ] Recruitment CRUD, including update, passes reliably through the rendered portal.
- [ ] A forced test failure produces a readable HTML report, trace, and screenshot/video artifact.
- [ ] No test points at production database, Clerk, or Supabase resources.
- [ ] The workflow duration and artifact size are recorded after several runs.

## Phase 6 — Incremental coverage

Add one area at a time after the Recruitment flow is stable:

1. Our Work/timeline CRUD without image upload.
2. Sponsor CRUD without image replacement.
3. Alumni CRUD.
4. Team-member update and soft deletion.
5. Member, unverified, and administrator authorization boundaries.

For each area, add tests only after identifying stable accessible controls. If an operation is difficult to target safely, first add semantic labels or `data-testid` attributes to the UI rather than relying on implementation-specific selectors.

## Future integration suite

Create a separate manually dispatched or scheduled workflow before testing external mutations:

- Use a dedicated Supabase test project or bucket for file uploads.
- Generate unique upload paths and remove every uploaded object during teardown.
- Use a dedicated Clerk development application for invitations and user administration.
- Record external test data identifiers for cleanup and auditability.
- Keep this suite separate from pull-request merge checks.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Clerk configuration or account role is incorrect | Add the authenticated navigation smoke test before CRUD coverage. |
| Secrets are unavailable to fork PRs | Run authenticated tests only for trusted changes; provide a separate non-secret smoke check for forks if needed. |
| Flaky tests due to shared mutation | Use one worker, unique data, row-scoped locators, and retry evidence. |
| CI environment validation fails | Provide complete dedicated test values; do not broadly skip validation. |
| Database changes leak to a shared service | Use only the service-container connection URL in CI. |
| Artifact storage grows | Upload only on failure and use short retention. |
| Yarn version drift | Resolve the package-manager mismatch before CI becomes required. |

## Definition of done

The first implementation is complete when the Recruitment CRUD test runs reliably on trusted pull requests and the default branch, each run starts with a fresh Postgres database, failure artifacts are available for debugging, and the job remains within the public-repository standard-runner free tier.
