"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Recruitment } from "@/generated/prisma/browser";

import EntityTable from "../EntityTable";
import { columns } from "./columns";

export type RecruitmentForm = Pick<
  Recruitment,
  "id" | "header" | "description" | "link" | "expiresAt"
>;

const RecruitmentTable = ({ forms }: { forms: RecruitmentForm[] }) => {
  return (
    <EntityTable
      columns={columns as ColumnDef<RecruitmentForm, unknown>[]}
      data={forms}
      tableHeader="Recruitment"
    />
  );
};

export default RecruitmentTable;
