# Portal End-to-End Testing

## Findings, cost assessment, and implementation plan

**Audience:** Calgary Solar Car website team  
**Repository:** `UCSolarCarTeam/Solar-Car-Website-Next` (public)  
**Decision:** Adopt the best-value GitHub Actions approach  
**Expected cost:** $0 per month under current assumptions  
**Prepared:** July 25, 2026

## Recommendation

Run Playwright and a temporary PostgreSQL database together on standard GitHub-hosted Ubuntu runners and use a Clerk development application for authentication.

This gives us browser-level coverage of the portal’s highest-risk workflows without introducing recurring infrastructure costs or exposing production data.

## Executive summary

The portal contains several administrator-facing create, read, update, and delete workflows. Browser-level tests are appropriate because they exercise the complete path from the rendered interface through server actions and Prisma to PostgreSQL. This catches integration failures that component tests alone may miss.

The repository is public and is expected to remain public. Standard GitHub-hosted runners are therefore free for this workload. A PostgreSQL service container can live for exactly one workflow job and disappear afterward, eliminating both hosted-database cost and the risk of modifying production data.

The recommended first milestone is one complete Recruitment CRUD flow. It provides meaningful coverage without invoking Supabase image storage or destructive Clerk administration. Once reliable, the same pattern can expand to timeline entries, sponsors, alumni, team records, and role-based authorization.

## Decision and expected cost

The selected approach is designed to have no recurring infrastructure cost. It uses services already present in the project only where they provide essential behaviour.

| Component | Selected approach | Expected monthly cost |
| --- | --- | ---: |
| CI runner | Standard Ubuntu GitHub-hosted runner | $0 |
| Browser tests | Playwright with Chromium | $0 |
| Test database | PostgreSQL 15 service container | $0 |
| Application server | Next.js started inside the runner | $0 |
| Authentication | Clerk development app and one test admin | $0 |
| Object storage | Excluded from initial CRUD suite | $0 |
| **Total** | **Recommended initial implementation** | **$0/month** |

This estimate assumes the repository remains public, uses standard runners, uploads artifacts only after failures, and authenticates against a dedicated development environment.

### GitHub Actions limits

GitHub provides free standard hosted-runner usage for public repositories. Larger runners remain billable and are not required for this test suite.

Artifact storage is the more relevant constraint. To remain comfortably within the included allowance:

- Upload traces, screenshots, and videos only when a test fails.
- Retain failure artifacts for five to seven days.
- Do not upload the Next.js build as an artifact.
- Do not record video for successful tests.

The expected workflow duration is approximately 5–12 minutes:

- Dependency installation: 1–3 minutes
- Prisma generation and migrations: less than 1 minute
- Next.js build or startup: 2–5 minutes
- Chromium tests: 1–4 minutes

Actual duration should be measured after the first test is implemented.

## Why the database should follow the runner lifecycle

- **Isolation:** Every job receives a clean database and cannot collide with another run.
- **Safety:** Destructive tests cannot alter production or shared staging data.
- **Migration coverage:** Prisma migrations are applied from zero during CI, exposing broken migrations early.
- **Cost control:** PostgreSQL consumes resources already included in the runner instead of requiring a continuously hosted database.
- **Fidelity:** Tests use PostgreSQL 15, matching the project’s database family instead of substituting SQLite.

The database should be created as a GitHub Actions service container. It starts with the job and is automatically destroyed when the job ends. No database backup, persistent volume, or external database account is required.

## Proposed test architecture

A single GitHub Actions job contains the application, browser, and database. The only external dependency required by the core suite is a low-value Clerk development application used to establish an authenticated administrator session.

```text
GitHub Actions job
├── Playwright + Chromium
│   └── Drives portal workflows and captures failure evidence
├── Next.js application
│   └── Serves the exact pull-request revision under test
└── PostgreSQL 15 service container
    └── Stores isolated test data and validates Prisma migrations

External development dependency
└── Clerk development application
    └── Authenticates a dedicated test administrator
```

## CI execution sequence

1. Check out the pull-request revision.
2. Install the project’s locked Node and Yarn dependencies.
3. Start PostgreSQL 15 and wait for its health check.
4. Generate the Prisma client and apply all migrations.
5. Start the Next.js application through Playwright’s web-server configuration.
6. Authenticate a dedicated administrator through Clerk’s testing helper.
7. Run the Chromium portal suite with one worker.
8. Upload traces, screenshots, and video only when a test fails.
9. Destroy the runner and its database automatically when the job ends.

## Authentication model

Create one permanent administrator in a Clerk development application and assign the public metadata role required by the portal.

CI receives these values through GitHub Actions secrets:

- Clerk development publishable key
- Clerk development secret key
- Test administrator email

Playwright uses Clerk’s official testing helper to establish a session. No password or saved browser state is committed.

The Clerk test application must contain no production users or valuable data. Authenticated tests should run only for trusted repository changes. Forked pull requests do not receive repository secrets and therefore cannot run the authenticated suite without an explicit trusted workflow.

## Test scope and rollout

### Phase 1 — Foundation

Add:

- Playwright configuration
- Clerk authentication setup
- PostgreSQL CI service
- Failure artifacts
- An unauthenticated portal redirect test
- An authenticated portal navigation test

**Outcome:** One repeatable test command that works locally and in CI.

### Phase 2 — First CRUD flow

Cover the Recruitment portal:

1. Sign in as the test administrator.
2. Open `/portal/recruitment`.
3. Create a uniquely named recruitment form.
4. Confirm it appears in the table.
5. Edit its header or description.
6. Confirm the updated value appears.
7. Delete it through the confirmation dialog.
8. Confirm it no longer appears.

Recruitment is the preferred first flow because it does not require image storage or destructive Clerk operations.

**Outcome:** One complete browser-to-database vertical slice.

### Phase 3 — Core portal expansion

Add coverage incrementally for:

- Our Work and timeline entries without image uploads
- Sponsors without image replacement
- Alumni records
- Team-member database records

Each test should create uniquely named data and clean it up.

**Outcome:** Coverage of the portal’s highest-value database workflows.

### Phase 4 — Authorization

Confirm:

- Administrators can access administrator routes.
- Ordinary members are redirected or denied.
- Unauthenticated visitors are redirected to sign-in.
- Unverified accounts cannot access protected portal content.

**Outcome:** Protection against role, middleware, and routing regressions.

### Phase 5 — Optional external integrations

Add separately controlled tests for:

- Supabase image uploads
- Clerk invitations
- Clerk user management

These tests should not run as part of every pull request. They mutate external services and require additional cleanup and credentials.

**Outcome:** External-service coverage without destabilizing the core suite.

## Test design standards

- Use accessible locators such as roles, labels, headings, and button names instead of CSS-module class names.
- Give every created record a unique identifier so concurrent or repeated runs cannot collide.
- Run CRUD tests with one Playwright worker until test-data partitioning supports safe parallelism.
- Clean up through the user interface when deletion is part of the behaviour under test.
- Add defensive teardown where practical so an interrupted test does not contaminate later local runs.
- Treat unexpected page exceptions, failed server actions, and relevant unhandled browser console errors as failures.
- Record traces on the first retry.
- Retain screenshots or video only for failures.
- Prefer deterministic test fixtures over the existing Faker-based local seed.
- Never depend on production data being present.

## What is deliberately excluded at first

Image-upload behaviour is excluded because it introduces Supabase storage, file cleanup, and additional credentials.

Clerk invitation and user deletion are excluded from the ordinary pull-request suite because they mutate an external identity system. These behaviours can be added later through dedicated test environments and separately triggered workflows.

Vercel preview deployments are not required for the main suite. Testing the application built directly inside CI provides faster feedback and keeps the temporary application and database in one lifecycle.

A small read-only smoke suite may eventually run after deployment if deployment-specific assurance becomes valuable.

## Portability across CI providers

GitHub Actions and Azure Pipelines both use YAML, but their workflow schemas are not interchangeable. Portability should live in the project command, not in the YAML.

The repository should expose one command that:

1. Applies database migrations.
2. Starts the application.
3. Runs Playwright.
4. Returns a standard success or failure exit code.

A future Azure, CircleCI, or AWS workflow should start a PostgreSQL service and invoke the same command.

If stronger portability becomes necessary, the application, browser, and database can later be packaged with Docker Compose. That additional complexity is not required for the initial GitHub implementation.

## Service decisions

### GitHub Actions

**Selected.**

The repository is permanently public, so standard GitHub-hosted runner usage is free. It is already the repository’s CI platform and has first-class PostgreSQL service-container support.

### Temporary PostgreSQL

**Selected.**

PostgreSQL runs inside the GitHub job and disappears when the job ends. This is safer and cheaper than using a shared hosted test database.

### Clerk

**Selected for authentication.**

Use a dedicated development application and one test administrator. There is no reason to replace Clerk or purchase a paid plan solely for this test suite.

## Cost controls and operational safeguards

| Area | Safeguard |
| --- | --- |
| Runner | Use standard Ubuntu runners; larger runners are billable. |
| Triggering | Run once per pull-request revision and on the main branch; avoid duplicate push and PR runs. |
| Artifacts | Upload only failure evidence and retain it for five to seven days. |
| Database | Use the job-scoped PostgreSQL container; never provide a production database URL. |
| Authentication | Use a dedicated Clerk development application and minimal test account. |
| External mutations | Keep invitations and identity deletion in a controlled, separately triggered suite. |

## Implementation checklist

- [ ] Create a dedicated Clerk development application and test administrator.
- [ ] Add Playwright and Clerk testing dependencies.
- [ ] Configure Chromium, one CI worker, retries, traces, screenshots, and failure-only video.
- [ ] Add the PostgreSQL 15 service and Prisma migration step to GitHub Actions.
- [ ] Implement unauthenticated redirect and authenticated portal navigation checks.
- [ ] Implement Recruitment create, read, update, and delete.
- [ ] Set short artifact retention and protect authentication secrets.
- [ ] Measure actual workflow duration before expanding coverage.
- [ ] Add the remaining database-backed portal areas incrementally.

## Definition of done

- [ ] The same Playwright command runs locally and in GitHub Actions.
- [ ] Every CI run receives a fresh PostgreSQL database.
- [ ] All Prisma migrations apply successfully to an empty database.
- [ ] Recruitment CRUD passes through the real portal interface.
- [ ] No production Clerk, Supabase, or database credentials are present.
- [ ] Failure artifacts are available without exceeding routine storage allowances.
- [ ] The pull-request check is stable enough to serve as a merge requirement.
- [ ] Expected recurring infrastructure cost remains $0 per month.

## Sources

- [GitHub Actions billing and included usage](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
- [GitHub PostgreSQL service containers](https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers)
- [Playwright CI guidance](https://playwright.dev/docs/ci)
- [Playwright authentication guidance](https://playwright.dev/docs/auth)
- [Playwright web-server configuration](https://playwright.dev/docs/test-webserver)
- [Clerk Playwright test helpers](https://clerk.com/docs/guides/development/testing/playwright/test-helpers)
- [Clerk pricing](https://clerk.com/pricing)
