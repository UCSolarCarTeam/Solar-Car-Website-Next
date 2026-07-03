"use client";

import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import EditSponsorCell from "@/app/_components/PortalComponents/EditSponsorCell";
import DeleteSponsor from "@/app/_components/PortalComponents/EditSponsorCell/DeleteSponsor";
import { Button } from "@/components/ui/button";
import { type Sponsor } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Sponsor>();
export const columns = [
  columnHelper.accessor("logoUrl", {
    cell: (info) => (
      <Image
        alt="sponsor logo"
        fill
        loading="eager"
        priority
        src={info.getValue()}
        style={{ objectFit: "cover" }}
      />
    ),
    header: "Logo",
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  }),
  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    header: "Description",
  }),
  columnHelper.accessor("websiteUrl", {
    cell: (info) => (
      <Link href={info.getValue()} prefetch={false}>
        {info.getValue()}
      </Link>
    ),
    header: "Website",
  }),
  columnHelper.accessor("sponsorLevel", {
    cell: (info) => info.getValue(),
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Sponsor Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  }),
  columnHelper.display({
    cell: (info) => (
      <EditSponsorCell currentRow={info.row.original} newSponsor={false} />
    ),
    enableHiding: false,
    id: "edit",
  }),
  columnHelper.display({
    cell: (info) => <DeleteSponsor currentRow={info.row.original} />,
    enableHiding: false,
    id: "delete",
  }),
];
