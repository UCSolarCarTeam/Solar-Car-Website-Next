import { expect, test } from "@playwright/test";

import { createRecruitmentData } from "../helpers/recruitment-data";
import { RecruitmentPage } from "../pages/recruitment.page";

test.describe("portal recruitment CRUD", () => {
  test("an administrator can open Recruitment", async ({ page }) => {
    const recruitmentPage = new RecruitmentPage(page);

    await recruitmentPage.goto();

    await expect(page).toHaveURL(/\/portal\/recruitment$/);
    await expect(recruitmentPage.getCreateButton()).toBeVisible();
  });

  test("an administrator can create, update, and delete a recruitment form", async ({
    page,
  }) => {
    const recruitmentPage = new RecruitmentPage(page);
    const created = createRecruitmentData(
      `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    );
    const updated = {
      ...created,
      description: `${created.description} Updated for the edit workflow.`,
      expiresAt: "2031-01-15T09:30",
      header: `${created.header} Updated`,
      link: `${created.link}/updated`,
    };

    await recruitmentPage.goto();
    const createDialog = await recruitmentPage.openCreateDialog();
    await recruitmentPage.fillForm(createDialog, created);
    await recruitmentPage.save(createDialog);

    await expect(
      page.getByText("Recruitment form created successfully!"),
    ).toBeVisible();

    const createdRow = recruitmentPage.getRowByHeader(created.header);
    await expect(createdRow).toBeVisible();
    await expect(recruitmentPage.getGoToFormLink(createdRow)).toHaveAttribute(
      "href",
      created.link,
    );

    const editDialog = await recruitmentPage.openEditDialog(createdRow);
    await expect(editDialog.getByLabel("Header")).toHaveValue(created.header);
    await expect(editDialog.getByLabel("Description")).toHaveValue(
      created.description,
    );
    await expect(editDialog.getByLabel("Link")).toHaveValue(created.link);
    await expect(editDialog.getByLabel("Expires At")).toHaveValue(
      created.expiresAt,
    );

    await recruitmentPage.fillForm(editDialog, updated);
    await recruitmentPage.save(editDialog);

    await expect(
      page.getByText("Recruitment form updated successfully!"),
    ).toBeVisible();

    const updatedRow = recruitmentPage.getRowByHeader(updated.header);
    await expect(updatedRow).toBeVisible();
    await expect(updatedRow).toContainText(updated.description);
    await expect(recruitmentPage.getGoToFormLink(updatedRow)).toHaveAttribute(
      "href",
      updated.link,
    );

    await recruitmentPage.deleteRow(updatedRow);

    await expect(page.getByText("Form deleted successfully!")).toBeVisible();
    await expect(recruitmentPage.getRowByHeader(updated.header)).toHaveCount(0);
  });
});
