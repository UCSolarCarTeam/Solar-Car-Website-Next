import Image from "next/image";
import { memo, useMemo } from "react";

import EditTeamCell from "@/components/EditTeamCell";
import { type RouterOutputs, api } from "@/utils/api";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./index.module.scss";

export type TeamMember = RouterOutputs["portal"]["getDBUsers"][number];

const TeamTable = () => {
  const users = api.portal.getDBUsers.useQuery();

  const columnHelper = useMemo(() => createColumnHelper<TeamMember>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("profilePictureUrl", {
        cell: (info) => {
          return (
            <Image
              alt="profile image"
              fill
              src={info.getValue() ?? "/DefaultProfilePicture.png"}
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
      columnHelper.accessor("fieldOfStudy", {
        cell: (info) => info.getValue(),
        header: "Field of Study",
      }),
      columnHelper.accessor("teamRole", {
        cell: (info) => info.getValue(),
        header: "Team Role",
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
      columnHelper.display({
        cell: (info) => <EditTeamCell currentRow={info.row.original} />,
        id: "edit",
      }),
    ],

    [columnHelper],
  );

  const table = useReactTable({
    columns,
    data: users.data ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      Team
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
    </>
  );
};

export default memo(TeamTable);
