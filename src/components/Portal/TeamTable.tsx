import Image from "next/image";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo, useMemo } from "react";

import EditTeamCell from "@/components/EditUserCell";
import { type RouterOutputs } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import DeleteUser from "../EditUserCell/DeleteUser";
import styles from "./index.module.scss";

export type TeamMember = RouterOutputs["portal"]["getDBUsers"][number];

const TeamTable = (props: { users: TeamMember[] }) => {
  const { user } = useUser();
  const columnHelper = useMemo(() => createColumnHelper<TeamMember>(), []);
  const columns = useMemo(
    () => [
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
        header: () => "Profile Picture",
      }),
      columnHelper.accessor("firstName", {
        cell: (info) => info.getValue(),
        header: "First Name",
      }),
      columnHelper.accessor("lastName", {
        cell: (info) => info.getValue(),
        header: "Last Name",
      }),
      columnHelper.accessor("ucid", {
        cell: (info) => info.getValue(),
        header: "UCID",
      }),
      columnHelper.accessor("schoolEmail", {
        cell: (info) => info.getValue(),
        header: "School Email",
      }),
      columnHelper.accessor("phoneNumber", {
        cell: (info) => info.getValue(),
        header: "Phone Number",
      }),
      // columnHelper.accessor("fieldOfStudy", {
      //   cell: (info) => info.getValue(),
      //   header: "Field of Study",
      // }),
      columnHelper.accessor("teamRole", {
        cell: (info) => {
          return (info.getValue() ?? "").replace(/([a-z])([A-Z])/g, "$1 $2");
        },
        header: "Team Role",
      }),
      // columnHelper.accessor("schoolYear", {
      //   cell: (info) => info.getValue(),
      //   header: "School Year",
      // }),
      // columnHelper.accessor("yearJoined", {
      //   header: "Year Joined",
      // }),
      // columnHelper.accessor("description", {
      //   cell: (info) => info.getValue(),
      //   header: "Description",
      // }),
      columnHelper.display({
        cell: (info) => <EditTeamCell currentRow={info.row.original} />,
        id: "edit",
      }),
      columnHelper.display({
        cell: (info) => <DeleteUser currentRow={info.row.original} />,
        id: "delete",
      }),
    ],

    [columnHelper],
  );

  const shouldShowModifyColumns = useMemo(
    () =>
      user?.publicMetadata?.role === "admin" ||
      user?.publicMetadata?.role === "business",
    [user?.publicMetadata?.role],
  );

  const table = useReactTable({
    columns,
    data: props.users ?? [],
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: {
        delete: shouldShowModifyColumns,
        edit: shouldShowModifyColumns,
      },
    },
  });

  return (
    <div>
      <div className={styles.tableHeader}>Team Members</div>
      <div className={styles.tableContainer}>
        <table>
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

export default memo(TeamTable);
