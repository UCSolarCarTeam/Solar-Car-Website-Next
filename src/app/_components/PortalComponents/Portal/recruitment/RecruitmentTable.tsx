import { Recruitment } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import EntityTable from "../EntityTable";
import { columns } from "./columns";

export type RecruitmentForm = Pick<
  Recruitment,
  "id" | "header" | "description" | "link" | "expiresAt"
>;

const RecruitmentTable = ({ forms }: { forms: RecruitmentForm[] }) => {
  return (
    <EntityTable
      tableHeader="Recruitment"
      data={forms}
      columns={columns as ColumnDef<RecruitmentForm, unknown>[]}
    />
  );
};

export default RecruitmentTable;
