"use client";

import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";

import EditTeamCell from "@/app/_components/PortalComponents/EditUserCell";
import DeleteUser from "@/app/_components/PortalComponents/EditUserCell/DeleteUser";
import { Button } from "@/components/ui/button";
import { type CellContext, createColumnHelper } from "@tanstack/react-table";

import { type TeamMember } from "../TeamTable";

const columnHelper = createColumnHelper<TeamMember>();
export const columns = (
  callback: (props: CellContext<TeamMember, unknown>) => void,
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
    enableHiding: false,
    header: () => "Profile Picture",
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
  columnHelper.accessor("ucid", {
    cell: (info) => info.getValue(),
    header: "UCID",
  }),
  columnHelper.accessor("schoolEmail", {
    cell: (info) => info.getValue(),
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          School Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  }),
  columnHelper.accessor("phoneNumber", {
    cell: (info) => info.getValue(),
    header: "Phone Number",
  }),
  columnHelper.accessor("fieldOfStudy", {
    cell: (info) => info.getValue(),
    header: "Field of Study",
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
  columnHelper.accessor("schoolYear", {
    cell: (info) => info.getValue(),
    header: "School Year",
  }),
  columnHelper.accessor("yearJoined", {
    header: "Year Joined",
  }),
  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    header: "Description",
  }),
  columnHelper.accessor("linkedIn", {
    cell: (info) => info.getValue(),
    header: "LinkedIn",
  }),
  columnHelper.display({
    cell: (info) => <EditTeamCell currentRow={info.row.original} />,
    enableHiding: false,
    id: "edit",
  }),
  columnHelper.display({
    cell: (info) => <DeleteUser currentRow={info.row.original} />,
    enableHiding: false,
    id: "delete",
  }),
  columnHelper.display({
    cell: (info) => {
      const isActive = !info.row.original.yearRetired;
      const handleAlumniClick = () => {
        callback(info);
      };
      return (
        <Button
          disabled={!isActive}
          onClick={handleAlumniClick}
          style={{
            backgroundColor: isActive ? "#ff4444" : "#ccc",
            cursor: isActive ? "pointer" : "not-allowed",
          }}
          title={isActive ? "Move to Alumni" : "Already an alumni"}
        >
          Alumni
        </Button>
      );
    },
    enableHiding: false,
    id: "moveToAlumni",
  }),
];
