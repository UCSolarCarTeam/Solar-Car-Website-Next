"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTransition } from "react";
import { useUser } from "@/app/_hooks/useUser";
import { runPortalAction } from "@/app/portal/_lib/runAction";
import { updateUserRole } from "@/app/portal/actions";
import type { ClerkPortalUser, UserRole } from "@/server/portal/types";

import EntityTable from "../EntityTable";
import { columns } from "./columns";

export type User = ClerkPortalUser;

const UsersTable = ({ data }: { data: User[] }) => {
  const [, startTransition] = useTransition();
  const { user } = useUser();

  const handleChange = (userId: string, role: UserRole) => {
    startTransition(() => {
      void runPortalAction(() => updateUserRole({ role, userId }), {
        error:
          "There was an error saving your changes. Please contact Telemetry Team.",
        loading: "Saving...",
        success: "User updated successfully!",
      });
    });
  };

  const userColumns = columns(user, handleChange);

  return (
    <EntityTable
      columns={userColumns as ColumnDef<User, unknown>[]}
      data={data}
      tableHeader={"Portal Users"}
    />
  );
};

export default UsersTable;
