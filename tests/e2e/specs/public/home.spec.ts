import { expect, test } from "@playwright/test";

test.describe("public home page", () => {
  test("loads without authentication", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Home/);
    await expect(page.getByRole("link", { name: "Team Portal" })).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Build the Future of Transportation.",
      }),
    ).toBeVisible();
  });
});
