import toast from "react-hot-toast";

import { useUser } from "@/app/_hooks/useUser";
import { type UserRole } from "@/server/api/routers/portal";
import { type RouterOutputs, trpc } from "@/trpc/react";
import { ColumnDef } from "@tanstack/react-table";

import EntityTable from "./EntityTable";
import { columns } from "./users/columns";

export type User = RouterOutputs["portal"]["getClerkUsers"][number];

const UsersTable = ({ data }: { data: User[] }) => {
  const utils = trpc.useUtils();
  const mutateUserRole = trpc.portal.updateUserRole.useMutation({
    onError: () => {
      toast.error(
        "There was an error saving your changes. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getClerkUsers.invalidate(), {
        loading: "Saving...",
        success: "User updated successfully!",
      });
    },
  });
  const { user } = useUser();
  const handleChange = (userId: string, role: UserRole) => {
    mutateUserRole.mutate({ userId, role });
  };
  const userColumns = columns(user, handleChange);

  return (
    <EntityTable
      data={data}
      columns={userColumns as ColumnDef<User, unknown>[]}
      tableHeader={"Portal Users"}
    />
  );
};

export default UsersTable;
