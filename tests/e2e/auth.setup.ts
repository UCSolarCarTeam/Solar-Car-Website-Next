import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";
import "dotenv/config";

const authFile = "playwright/.auth/admin.json";

setup("authenticate portal administrator", async ({ page }) => {
  const emailAddress = process.env.E2E_ADMIN_EMAIL;
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!emailAddress) {
    throw new Error("E2E_ADMIN_EMAIL must be set to run portal E2E tests.");
  }

  if (!publishableKey || !secretKey) {
    throw new Error(
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY must be set to run portal E2E tests.",
    );
  }

  await clerkSetup({ publishableKey, secretKey });
  await page.goto("/portal/sign-in");
  await clerk.signIn({ emailAddress, page });
  await mkdir(dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
