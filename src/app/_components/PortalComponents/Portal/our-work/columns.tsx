import { ArrowUpDown } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";

import EditOurWorkEntryCell from "../../EditOurWorkEntryCell";
import DeleteOurWorkEntry from "../../EditOurWorkEntryCell/DeleteOurWorkEntry";
import { OurWorkEntry } from "./OurWorkEntriesTable";

const columnHelper = createColumnHelper<OurWorkEntry>();
export const columns = [
  columnHelper.accessor((row) => row.year * 100 + row.monthNum, {
    cell: (info) => `${info.row.original.monthName} ${info.row.original.year}`,
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    id: "date",
  }),
  columnHelper.accessor("imageUrl", {
    cell: (info) => {
      const url = info.getValue();
      return url ? (
        <Image
          alt="Timeline"
          height={50}
          src={url}
          style={{ objectFit: "cover" }}
          width={50}
        />
      ) : (
        <span>No image</span>
      );
    },
    header: "Image",
  }),
  columnHelper.accessor("description", {
    cell: (info) => {
      const desc = info.getValue();
      return desc ? (
        <div
          style={{
            maxWidth: "300px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {desc}
        </div>
      ) : (
        <span>-</span>
      );
    },
    header: "Description",
  }),
  columnHelper.display({
    cell: (info) => (
      <EditOurWorkEntryCell
        currentRow={{
          description: info.row.original.description,
          id: info.row.original.id,
          imageUrl: info.row.original.imageUrl,
          monthName: info.row.original.monthName,
          monthNum: info.row.original.monthNum,
          year: info.row.original.year,
        }}
        newEntry={false}
      />
    ),
    id: "edit",
    enableHiding: false,
  }),
  columnHelper.display({
    cell: (info) => (
      <DeleteOurWorkEntry
        currentRow={{
          description: info.row.original.description,
          id: info.row.original.id,
          imageUrl: info.row.original.imageUrl,
          monthName: info.row.original.monthName,
          monthNum: info.row.original.monthNum,
          year: info.row.original.year,
        }}
      />
    ),
    id: "delete",
    enableHiding: false,
  }),
];
