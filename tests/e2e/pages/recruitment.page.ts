import type { Locator, Page } from "@playwright/test";

import type { RecruitmentFormData } from "../helpers/recruitment-data";

const RECRUITMENT_PAGE = "/portal/recruitment";
const ADD_BUTTON_NAME = "Add recruitment form";
const SAVE_BUTTON_NAME = "Save";
const GO_TO_FORM_LINK_NAME = "Go to Form";

export class RecruitmentPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto(RECRUITMENT_PAGE);
  }

  async openCreateDialog() {
    await this.page.getByRole("button", { name: ADD_BUTTON_NAME }).click();
    return this.getDialog("New Form");
  }

  async openEditDialog(row: Locator) {
    await row.getByRole("button", { name: "Edit" }).click();
    return this.getDialog("Edit Form");
  }

  async save(dialog: Locator) {
    await dialog.getByRole("button", { name: SAVE_BUTTON_NAME }).click();
  }

  async fillForm(dialog: Locator, data: RecruitmentFormData) {
    await dialog.getByLabel("Header").fill(data.header);
    await dialog.getByLabel("Description").fill(data.description);
    await dialog.getByLabel("Link").fill(data.link);
    await dialog.getByLabel("Expires At").fill(data.expiresAt);
  }

  getRowByHeader(header: string) {
    return this.page.getByRole("row").filter({ hasText: header });
  }

  getGoToFormLink(row: Locator) {
    return row.getByRole("link", { name: GO_TO_FORM_LINK_NAME });
  }

  async deleteRow(row: Locator) {
    await row.getByRole("button", { name: "Delete" }).click();
    const confirmation = this.page.getByRole("dialog", { name: "Delete Item" });
    await confirmation.getByRole("button", { name: "Yes, delete" }).click();
  }

  getCreateButton() {
    return this.page.getByRole("button", { name: ADD_BUTTON_NAME });
  }

  private getDialog(name: string) {
    return this.page.getByRole("dialog", { name });
  }
}
