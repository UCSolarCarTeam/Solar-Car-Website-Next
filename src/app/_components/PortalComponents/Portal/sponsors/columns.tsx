"use client";

import Image from "next/image";
import Link from "next/link";

import EditSponsorCell from "@/app/_components/PortalComponents/EditSponsorCell";
import DeleteSponsor from "@/app/_components/PortalComponents/EditSponsorCell/DeleteSponsor";
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
    header: "Name",
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
    header: "Sponsor Level",
  }),
  columnHelper.display({
    cell: (info) => (
      <EditSponsorCell currentRow={info.row.original} newSponsor={false} />
    ),
    id: "edit",
  }),
  columnHelper.display({
    cell: (info) => <DeleteSponsor currentRow={info.row.original} />,
    id: "delete",
  }),
];
