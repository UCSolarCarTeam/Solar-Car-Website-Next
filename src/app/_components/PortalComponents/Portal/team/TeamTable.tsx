"use client";

import { useState } from "react";

import { MoveToAlumniModal } from "@/app/_components/PortalComponents/EditUserCell/MoveToAlumniModal";
import { useUser } from "@/app/_hooks/useUser";
import { type RouterOutputs } from "@/trpc/react";
import type { User } from "@prisma/client";
import {
  type CellContext,
  type ColumnDef,
  type VisibilityState,
} from "@tanstack/react-table";

import type TeamMember from "../../../TeamMember";
import EntityTable from "../EntityTable";
import { columns } from "./columns";

export type TeamMember = RouterOutputs["portal"]["getDBUsers"][number];
const TeamTable = ({ users }: { users: TeamMember[] }) => {
  const { user } = useUser();
  const initialVisibility: VisibilityState = {
    delete: ["admin", "business"].includes(user?.publicMetadata.role ?? ""),
    description: false,
    fieldOfStudy: false,
    linkedIn: false,
    moveToAlumni: ["admin", "business"].includes(
      user?.publicMetadata.role ?? "",
    ),
    schoolYear: false,
    ucid: false,
    yearJoined: false,
  } satisfies Partial<Record<keyof User | ({} & string), boolean>>;
  const [alumniModal, setAlumniModal] = useState<{
    userId: number;
    userName: string;
  } | null>(null);
  const handleAlumniClick = (info: CellContext<TeamMember, unknown>) => {
    setAlumniModal({
      userId: info.row.original.id,
      userName:
        `${info.row.original.firstName ?? ""} ${info.row.original.lastName ?? ""}`.trim(),
    });
  };
  const teamColumns = columns(handleAlumniClick) as ColumnDef<
    TeamMember,
    unknown
  >[];
  return (
    <EntityTable
      columns={teamColumns}
      data={users}
      filterPlaceholder={"Filter team members..."}
      initialVisibility={initialVisibility}
      tableHeader={"Filter team members..."}
    >
      {alumniModal && (
        <MoveToAlumniModal
          onClose={() => setAlumniModal(null)}
          userId={alumniModal.userId}
          userName={alumniModal.userName}
        />
      )}
    </EntityTable>
  );
};

export default TeamTable;
