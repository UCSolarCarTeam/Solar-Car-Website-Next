import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";

import BasicButton, {
  ButtonVariant,
} from "@/app/_components/Buttons/BasicButton";
import { formatDateOnly } from "@/app/_lib/utils";
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";

import { type AlumniMember } from "./AlumniTable";

const columnHelper = createColumnHelper<AlumniMember>();

export const columns = (
  handleEdit: (alumni: AlumniMember) => void,
  handleDelete: (id: number) => void,
) => [
  columnHelper.accessor("profilePictureUrl", {
    cell: (info) => {
      return (
        <Image
          alt="profile image"
          fill
          loading="eager"
          priority
          src={info.getValue() ?? defaultProfilePicture}
          style={{ objectFit: "cover" }}
        />
      );
    },
    header: "Profile",
  }),
  columnHelper.accessor("firstName", {
    cell: (info) => info.getValue(),
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  }),
  columnHelper.accessor("lastName", {
    cell: (info) => info.getValue(),
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  }),
  columnHelper.accessor("teamRole", {
    cell: (info) => {
      return (info.getValue() ?? "").replace(/([a-z])([A-Z])/g, "$1 $2");
    },
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Team Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  }),
  columnHelper.accessor("company", {
    cell: (info) => info.getValue(),
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  }),
  columnHelper.accessor("companyTitle", {
    cell: (info) => info.getValue(),
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Position
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  }),
  columnHelper.display({
    cell: (info) => {
      const row = info.row.original;
      if (!row.yearJoined && !row.yearRetired) return "";
      const joined = formatDateOnly(row.yearJoined).slice(0, 4) || "?";
      const retired = formatDateOnly(row.yearRetired).slice(0, 4) || "?";
      return `${joined} - ${retired}`;
    },
    header: "Tenure",
  }),
  columnHelper.display({
    cell: (info) => (
      <Button onClick={() => handleEdit(info.row.original)}>Edit</Button>
    ),
    enableHiding: false,
    id: "edit",
  }),
  columnHelper.display({
    cell: (info) => (
      <BasicButton
        onConfirmDelete={() => handleDelete(info.row.original.id)}
        variant={ButtonVariant.Default}
      >
        Delete
      </BasicButton>
    ),
    enableHiding: false,
    id: "delete",
  }),
];
