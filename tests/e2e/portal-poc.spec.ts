import { expect, test } from "@playwright/test";

const uniqueHeader = () =>
  `E2E Recruitment ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

test.describe("portal Recruitment POC", () => {
  test("an administrator can open Recruitment", async ({ page }) => {
    await page.goto("/portal/recruitment");

    await expect(page).toHaveURL(/\/portal\/recruitment$/);
    await expect(
      page.getByRole("button", { name: "Add recruitment form" }),
    ).toBeVisible();
  });

  test("an administrator can create and delete a Recruitment record", async ({
    page,
  }) => {
    const header = uniqueHeader();

    await page.goto("/portal/recruitment");
    await page.getByRole("button", { name: "Add recruitment form" }).click();

    const form = page.getByRole("dialog", { name: "New Form" });
    await form.getByLabel("Header").fill(header);
    await form
      .getByLabel("Description")
      .fill("Created by the Playwright E2E POC.");
    await form.getByLabel("Link").fill("https://example.com/e2e-recruitment");
    await form.getByLabel("Expires At").fill("2030-12-31T12:00");
    await form.getByRole("button", { name: "Save" }).click();

    await expect(
      page.getByText("Recruitment form created successfully!"),
    ).toBeVisible();

    const row = page.getByRole("row").filter({ hasText: header });
    await expect(row).toBeVisible();

    await row.getByRole("button", { name: "Delete" }).click();
    const confirmation = page.getByRole("dialog", { name: "Delete Item" });
    await confirmation.getByRole("button", { name: "Yes, delete" }).click();

    await expect(page.getByText("Form deleted successfully!")).toBeVisible();
    await expect(row).toHaveCount(0);
  });
});
