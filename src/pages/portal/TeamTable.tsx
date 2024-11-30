import Image from "next/image";
import {
  type Dispatch,
  type SetStateAction,
  memo,
  useMemo,
  useState,
} from "react";

import EditCell from "@/components/EditableComponents/EditCell";
import EditableTableCell from "@/components/EditableComponents/EditableTableCell";
import { type RouterOutputs, api } from "@/utils/api";
import {
  type RowData,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./index.module.scss";

export type TeamMember = RouterOutputs["portal"]["getDBUsers"][number];

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    rowsBeingEdited: Record<string, boolean>;
    setRowsBeingEdited: Dispatch<SetStateAction<Record<string, boolean>>>;
  }
  interface ColumnMeta<TData extends RowData, TValue> {
    type: string;
  }
}

const TeamTable = () => {
  const users = api.portal.getDBUsers.useQuery();
  const [rowsBeingEdited, setRowsBeingEdited] = useState<
    Record<string, boolean>
  >({});

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
        cell: EditableTableCell,
        header: "First Name",
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor("lastName", {
        cell: EditableTableCell,
        header: "Last Name",
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor("teamRole", {
        cell: EditableTableCell,
        header: "Field of Study",
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor("teamRole", {
        cell: EditableTableCell,
        header: "Team Role",
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor("schoolYear", {
        cell: EditableTableCell,
        header: "School Year",
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor("yearJoined", {
        cell: EditableTableCell,
        header: "Year Joined",
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor("description", {
        cell: EditableTableCell,
        header: "Description",
        meta: {
          type: "text",
        },
      }),
      columnHelper.display({
        cell: EditCell,
        id: "edit",
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    columns,
    data: users.data ?? [],
    getCoreRowModel: getCoreRowModel(),
    meta: {
      rowsBeingEdited,
      setRowsBeingEdited,
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        // setData((old) =>
        //   old.map((row, index) => {
        //     if (index === rowIndex) {
        //       return {
        //         ...old[rowIndex],
        //         [columnId]: value,
        //       };
        //     }
        //     return row;
        //   })
        // );
      },
    },
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
