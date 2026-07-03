import Link from "next/link";

import { toLocalDateTimeString } from "@/app/_lib/toLocalDate";
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";

import EditRecruitmentFormCell from "../../EditRecruitmentFormCell";
import DeleteForm from "../../EditRecruitmentFormCell/DeleteForm";
import { RecruitmentForm } from "../RecruitmentTable";

const columnHelper = createColumnHelper<RecruitmentForm>();
export const columns = [
  columnHelper.accessor("header", {
    cell: (info) => info.getValue(),
    header: "Header",
  }),
  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    header: "Description",
  }),
  columnHelper.accessor("link", {
    cell: (info) => (
      <Link href={info.getValue()} rel="noopener noreferrer" target="_blank">
        <Button>Go to Form</Button>
      </Link>
    ),
    header: "Link",
  }),
  columnHelper.accessor("expiresAt", {
    cell: (info) => {
      const date = new Date(info.getValue());
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
    header: "Expires At",
  }),
  columnHelper.display({
    cell: (info) => (
      <EditRecruitmentFormCell
        currentRow={{
          ...info.row.original,
          description: info.row.original.description,
          expiresAt: toLocalDateTimeString(info.row.original.expiresAt),
          header: info.row.original.header,
          link: info.row.original.link,
        }}
        newForm={false}
      />
    ),
    id: "edit",
  }),
  columnHelper.display({
    cell: (info) => (
      <DeleteForm
        currentRow={{
          ...info.row.original,
          description: info.row.original.description,
          expiresAt: toLocalDateTimeString(info.row.original.expiresAt),
          header: info.row.original.header,
          link: info.row.original.link,
        }}
        currentUser={undefined}
      />
    ),
    id: "delete",
  }),
];
