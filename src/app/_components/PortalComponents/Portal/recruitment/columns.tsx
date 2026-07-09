import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { toLocalDateTimeString } from "@/app/_lib/toLocalDate";
import { Button } from "@/components/ui/button";

import EditRecruitmentFormCell from "../../EditRecruitmentFormCell";
import DeleteForm from "../../EditRecruitmentFormCell/DeleteForm";
import type { RecruitmentForm } from "./RecruitmentTable";

const columnHelper = createColumnHelper<RecruitmentForm>();
export const columns = [
  columnHelper.accessor("header", {
    cell: (info) => info.getValue(),
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Header
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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
    enableHiding: false,
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
    enableHiding: false,
    id: "delete",
  }),
];
