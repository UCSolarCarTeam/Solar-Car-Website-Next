import { constants } from "node:fs";
import { access } from "node:fs/promises";
import { join } from "node:path";

import { test as base, type Page } from "@playwright/test";

type AuthFixtures = {
  adminPage: Page;
};

const ADMIN_STORAGE_STATE = join(
  process.cwd(),
  "tests/e2e/storage/admin.json",
);

const requireStorageState = async (storageStatePath: string) => {
  try {
    await access(storageStatePath, constants.F_OK);
  } catch {
    throw new Error(
      `Missing Playwright storage state at ${storageStatePath}. Run "yarn test:e2e:auth" to generate it first.`,
    );
  }
};

export const test = base.extend<AuthFixtures>({
  adminPage: async ({ browser }, use) => {
    await requireStorageState(ADMIN_STORAGE_STATE);

    const context = await browser.newContext({
      storageState: ADMIN_STORAGE_STATE,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
