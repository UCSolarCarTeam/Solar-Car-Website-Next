"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import PortalTableContainer from "./PortalTableContainer";

export type EntityTableProps<T> = {
  data: T[];
  initialVisibility?: VisibilityState;
  columns: ColumnDef<T, unknown>[];
  children?: React.ReactNode;
  tableHeader?: React.ReactNode;
  filterPlaceholder?: string;
};
export default function EntityTable<T>(props: EntityTableProps<T>) {
  const {
    children,
    columns,
    data,
    filterPlaceholder,
    initialVisibility,
    tableHeader,
  } = props;
  const [globalFilter, setGlobalFilters] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialVisibility ?? {},
  );
  const table = useReactTable({
    columns,
    data,
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
    <div>
      <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-4 text-[1.2rem] font-semibold text-[#1f2937] [@media(max-width:768px)]:items-start [@media(max-width:768px)]:text-base">
        <div className="min-w-0">{tableHeader}</div>
        <div className="ml-auto flex min-w-0 max-w-100 flex-[1_1_280px] flex-wrap items-center gap-2 [@media(max-width:768px)]:ml-0 [@media(max-width:768px)]:max-w-none [@media(max-width:768px)]:basis-full">
          <Input
            aria-label={filterPlaceholder ?? "Filter items"}
            className="h-9 w-auto min-w-0 flex-[1_1_200px] bg-white font-normal text-[#1f2937]"
            onChange={(event) =>
              table.setGlobalFilter(String(event.target.value))
            }
            placeholder={filterPlaceholder ?? "Filter items..."}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Columns</Button>
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
      <PortalTableContainer>
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
      </PortalTableContainer>
      {children}
    </div>
  );
}
