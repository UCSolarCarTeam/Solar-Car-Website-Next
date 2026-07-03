"use client";

import { useState } from "react";

import { MoveToAlumniModal } from "@/app/_components/PortalComponents/EditUserCell/MoveToAlumniModal";
import { useUser } from "@/app/_hooks/useUser";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { type RouterOutputs } from "@/trpc/react";
import type { User } from "@prisma/client";
import {
  type CellContext,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type TeamMember from "../../TeamMember";
import styles from "./index.module.scss";
import { columns } from "./team/columns";

export type TeamMember = RouterOutputs["portal"]["getDBUsers"][number];
const TeamTable = ({ users }: { users: TeamMember[] }) => {
  const { user: currentUser } = useUser();
  const initialVisibility: VisibilityState = {
    delete: ["admin", "business"].includes(
      currentUser?.publicMetadata.role ?? "",
    ),
    description: false,
    fieldOfStudy: false,
    linkedIn: false,
    moveToAlumni: ["admin", "business"].includes(
      currentUser?.publicMetadata.role ?? "",
    ),
    schoolYear: false,
    ucid: false,
    yearJoined: false,
  } satisfies Partial<Record<keyof User | ({} & string), boolean>>;
  const [globalFilter, setGlobalFilters] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initialVisibility);
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

  const table = useReactTable({
    columns: columns(handleAlumniClick),
    data: users,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilters,
    onSortingChange: setSorting,
    state: {
      columnVisibility,
      globalFilter,
      sorting,
    },
  });

  return (
    <div id="team">
      <div className={styles.tableHeader}>
        <div>Team Members</div>
        <div className="flex items-center py-4 gap-2">
          <Input
            className={styles.searchBar}
            onChange={(event) =>
              table.setGlobalFilter(String(event.target.value))
            }
            placeholder="Filter team members..."
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="ml-auto" variant="secondary">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      checked={column.getIsVisible()}
                      className="capitalize"
                      key={column.id}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
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
      {alumniModal && (
        <MoveToAlumniModal
          onClose={() => setAlumniModal(null)}
          userId={alumniModal.userId}
          userName={alumniModal.userName}
        />
      )}
    </div>
  );
};

export default TeamTable;
