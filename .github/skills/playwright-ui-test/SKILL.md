---
name: playwright-ui-test
description: 'Create Playwright UI tests for a page or feature on a page. Use when writing a new spec, choosing a test file name, structuring constants and fixtures, or standardizing test titles and descriptions for frontend coverage.'
user-invocable: true
---

# Playwright UI Test Skill

Use this skill when creating a Playwright UI test for a page or a feature on a page.

## What This Skill Produces
- A single Playwright spec file for one page or feature
- A clear, maintainable test name and file name
- Consistent setup with constants at the top of the file
- Shared fixtures or page objects when they improve reuse
- Clear `describe` and `test` titles

## Default Naming Rules
- Prefer a feature-based file name that is concise and descriptive.
- If the route is the clearest way to identify the UI surface, use a route-derived slug.
- Keep the spec name aligned with the behavior under test.
- Use the repository's existing `*.spec.ts` convention.

## Test Structure Rules
1. Start with the page or feature goal.
2. Identify the minimal path a user takes through the UI.
3. Define selectors, URLs, and test data as constants near the top of the file.
4. Keep assertions behavior-focused and visible to a reader.
5. Use `describe` blocks for the page or feature scope.
6. Use short, specific `test` titles that describe the outcome.
7. Prefer locators and expectations over hard-coded waits.
8. Use fixtures or page objects only when they reduce repetition or improve clarity.

## Authentication Rules for Protected Routes
1. Authentication must not be applied globally.
2. Public routes should run with the normal `page` fixture and no `storageState`.
3. Protected routes must explicitly import an authentication fixture such as `auth.fixture.ts`.
4. Authentication fixtures should load a pre-generated `storageState` file such as `admin.json` or `student.json`.
5. A one-time setup script such as `auth.setup.ts` should generate storage state files, but it should not run before every test.
6. Public and protected tests should be separated under `tests/e2e/specs/public/` and `tests/e2e/specs/protected/`.
7. Tests should make authentication requirements obvious by choosing the correct fixture import.
8. Authentication logic should live in fixtures and setup scripts, not inside spec files.

## Page Object Separation Rules
- Page Objects must live in `tests/e2e/pages/` and never inside application code such as `src/app/...`.
- Spec files must live in `tests/e2e/specs/` and should import Page Objects rather than embedding UI interaction logic directly.
- Page Objects should encapsulate navigation (`goto()`), UI interactions (`fillForm()`, `openCreateDialog()`), element lookups (`getRowByHeader()`), and reusable workflows (`save()`, `deleteRow()`).
- Spec files should contain test descriptions, assertions, and high-level flow using Page Object methods.
- Shared data builders, such as form data factories, must live in `tests/e2e/helpers/`.
- Tests should read like user stories; Page Objects should hide implementation details.

## Clarify Before Generating
Ask a follow-up question when any of these are unclear:
- Which page or feature should be covered
- Whether the file name should be feature-based or route-based for this case
- Which shared setup belongs in fixtures versus inline test code
- What the test should prove versus what should just be smoke coverage

## Recommended Workflow
1. Confirm the page, feature, or route under test.
2. Choose the spec file name.
3. Decide whether the test is a smoke check or a deeper flow.
4. Write constants, fixtures, and helpers before the test body.
5. Add a `describe` block with a clear page or feature label.
6. Add one or more focused `test` cases with explicit expectations.
7. Review the file for naming consistency, selector clarity, and unnecessary repetition.

## Quality Checklist
- The file name clearly matches the page or feature.
- The test title tells the reader what behavior is being verified.
- Constants are grouped at the top when they are reused.
- Fixtures or page objects are present only when they add value.
- Assertions describe visible outcomes, not implementation details.
- Page Objects live under `tests/e2e/pages/`, not in application code.
- Spec files live under `tests/e2e/specs/` and keep UI interaction details inside Page Objects.
- Shared data builders live under `tests/e2e/helpers/`.
- The spec reads like a user story and uses Page Object methods for the high-level flow.
- The spec follows the repo's Playwright conventions.
- Public tests do not import auth fixtures, while protected tests explicitly do.
- Protected tests load pre-generated storage state through imported fixtures only.
- One-time auth setup scripts create storage state files without being wired into every test run.

## Example Patterns
- `home-page.spec.ts` for a general page-level smoke test
- `portal-login.spec.ts` for a feature-specific flow
- `portal-admin.spec.ts` when the route and feature are tightly coupled

## If You Need More Detail
If the page structure, route naming, or fixture boundary is ambiguous, stop and ask before generating the spec.
