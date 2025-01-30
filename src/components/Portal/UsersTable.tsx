import Image from "next/image";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { useMemo } from "react";
import { memo } from "react";
import Select from "react-select";

import { type UserRole } from "@/server/api/routers/portal";
import { type RouterOutputs, api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./index.module.scss";

type User = RouterOutputs["portal"]["getClerkUsers"][number];

const UsersTable = (props: { users: User[] }) => {
  const { user } = useUser();
  const utils = api.useUtils();
  const mutateUserRole = api.portal.updateUserRole.useMutation({
    onSuccess: async () => {
      await utils.portal.getClerkUsers.invalidate();
    },
  });

  const columnHelper = useMemo(() => createColumnHelper<User>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("imageUrl", {
        cell: (info) => (
          <Image
            alt="profile image"
            height={48}
            loading="eager"
            priority
            src={info.getValue() ?? defaultProfilePicture}
            width={48}
          />
        ),
        header: () => null,
      }),
      columnHelper.accessor("username", {
        cell: (info) => info.getValue(),
        header: "Username",
      }),
      columnHelper.accessor("firstName", {
        cell: (info) => info.getValue(),
        header: "First Name",
      }),
      columnHelper.accessor("lastName", {
        cell: (info) => info.getValue(),
        header: "Last Name",
      }),
      columnHelper.accessor("email", {
        cell: (info) => info.getValue(),
        header: "Email",
      }),
      columnHelper.accessor("role", {
        cell: (info) => (
          <Select
            isDisabled={
              user?.publicMetadata.role !== "admin" ||
              info.row.original.id === user?.id
            }
            onChange={(option) => {
              if (option) {
                mutateUserRole.mutate({
                  role: option.value as UserRole,
                  userId: info.row.original.id,
                });
              }
            }}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Business", value: "business" },
              { label: "Mechanical", value: "mechanical" },
              { label: "Member", value: "member" },
            ]}
            value={{
              label:
                info.getValue() === undefined
                  ? "Unverified"
                  : String(info.getValue()).charAt(0).toUpperCase() +
                    String(info.getValue()).slice(1),
              value: info.getValue() ?? "Unverified",
            }}
          />
        ),
        header: "Role",
      }),
    ],
    [columnHelper, mutateUserRole, user?.id, user?.publicMetadata.role],
  );

  const table = useReactTable({
    columns,
    data: props.users ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      Portal Users
      <table className={styles.usersTable}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(UsersTable);
