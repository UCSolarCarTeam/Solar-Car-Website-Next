import { constants } from "node:fs";
import { access, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { chromium } from "@playwright/test";
import "dotenv/config";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const STORAGE_DIR = join(process.cwd(), "tests/e2e/storage");

const STORAGE_FILES = {
  admin: join(STORAGE_DIR, "admin.json"),
  student: join(STORAGE_DIR, "student.json"),
} as const;

const ROLE_EMAIL_ENV = {
  admin: "E2E_ADMIN_EMAIL",
  student: "E2E_STUDENT_EMAIL",
} as const;

type Role = keyof typeof STORAGE_FILES;

const fileExists = async (filePath: string) => {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const generateStorageState = async (role: Role) => {
  const storageFile = STORAGE_FILES[role];
  if (await fileExists(storageFile)) {
    return;
  }

  const emailAddress = process.env[ROLE_EMAIL_ENV[role]];
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!emailAddress) {
    throw new Error(
      `${ROLE_EMAIL_ENV[role]} must be set to generate ${role} storage state.`,
    );
  }

  if (!publishableKey || !secretKey) {
    throw new Error(
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY must be set to generate storage state.",
    );
  }

  await clerkSetup({ publishableKey, secretKey });

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(new URL("/portal/sign-in", baseURL).toString());
    await clerk.signIn({ emailAddress, page });
    await mkdir(dirname(storageFile), { recursive: true });
    await context.storageState({ path: storageFile });
    await context.close();
  } finally {
    await browser.close();
  }
};

const main = async () => {
  await generateStorageState("admin");
  await generateStorageState("student");
};

await main();
