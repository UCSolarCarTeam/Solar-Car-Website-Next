import Image from "next/image";
import defaultProfilePictureSquare from "public/assets/DefaultProfilePicture-Square.png";
import { useMemo, useState } from "react";
import { memo } from "react";
import toast from "react-hot-toast";
import Select from "react-select";

import { type UserRole } from "@/server/api/routers/portal";
import { type RouterOutputs, trpc } from "@/trpc/react";
import { type UserResource } from "@clerk/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import SearchBar from "../SearchBar";
import styles from "./index.module.scss";

type User = RouterOutputs["portal"]["getClerkUsers"][number];

const UsersTable = (props: {
  users: User[];
  currentUser: UserResource | undefined | null;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const dataToRender = useMemo(
    () =>
      props.users.filter((user) => {
        const lowerSearch = searchValue.toLowerCase();
        return (
          (user.firstName ?? "").toLowerCase().includes(lowerSearch) ||
          (user.lastName ?? "").toLowerCase().includes(lowerSearch) ||
          (user.username ?? "").toLowerCase().includes(lowerSearch) ||
          searchValue.toLowerCase() === ""
        );
      }) ?? [],
    [props.users, searchValue],
  );
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

  const dropdownOptions = useMemo(
    () => [
      { label: "Admin", value: "admin" },
      { label: "Business", value: "business" },
      { label: "Mechanical Lead", value: "mechanicallead" },
      { label: "Electrical Lead", value: "electricallead" },
      { label: "Member", value: "member" },
    ],
    [],
  );

  const columnHelper = useMemo(() => createColumnHelper<User>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("imageUrl", {
        cell: (info) => (
          <Image
            alt="profile image"
            height={64}
            loading="eager"
            priority
            src={info.getValue() ?? defaultProfilePictureSquare}
            width={64}
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
              ![
                "admin",
                "business",
                "mechanicallead",
                "electricallead",
              ].includes(
                (props.currentUser?.publicMetadata.role as string) ?? "",
              ) || info.row.original.id === props.currentUser?.id
            }
            onChange={(option) => {
              if (option) {
                mutateUserRole.mutate({
                  role: option.value as UserRole,
                  userId: info.row.original.id,
                });
              }
            }}
            options={dropdownOptions}
            value={
              dropdownOptions.find(
                (option) => option.value === info.getValue(),
              ) ?? { label: "Unverified", value: "Unverified" }
            }
          />
        ),
        header: "Role",
      }),
    ],
    [
      columnHelper,
      dropdownOptions,
      mutateUserRole,
      props.currentUser?.id,
      props.currentUser?.publicMetadata.role,
    ],
  );

  const table = useReactTable({
    columns,
    data: dataToRender,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div id="users">
      <div className={styles.tableHeader}>
        <div>Portal Users</div>
        <SearchBar setSearchValue={setSearchValue} value={searchValue} />
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
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
    </div>
  );
};

export default memo(UsersTable);
