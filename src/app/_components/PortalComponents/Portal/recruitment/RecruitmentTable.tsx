"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Recruitment } from "@/generated/prisma/browser";

import EditRecruitmentFormCell from "../../EditRecruitmentFormCell";
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
      tableHeader={
        <div className="flex items-center gap-3">
          <span>Recruitment</span>
          <EditRecruitmentFormCell
            currentRow={{
              description: "",
              expiresAt: "",
              header: "",
              id: 0,
              link: "",
            }}
            newForm
          />
        </div>
      }
    />
  );
};

export default RecruitmentTable;
