import Image from "next/image";
import { memo, useMemo, useState } from "react";

import EditOurWorkEntryCell from "@/app/_components/PortalComponents/EditOurWorkEntryCell";
import DeleteOurWorkEntry from "@/app/_components/PortalComponents/EditOurWorkEntryCell/DeleteOurWorkEntry";
import styles from "@/app/_components/PortalComponents/Portal/index.module.scss";
import SearchBar from "@/app/_components/PortalComponents/SearchBar";
import { type UserResource } from "@clerk/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export interface OurWorkEntry {
  id: number;
  year: number;
  monthName: string;
  monthNum: number;
  imageUrl: string | null;
  description: string | null;
}

const OurWorkEntriesTable = (props: {
  entries: OurWorkEntry[];
  currentUser: UserResource | undefined | null;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const dataToRender = useMemo(
    () =>
      (props.entries ?? [])
        .filter((item) => {
          const lowerSearch = searchValue.toLowerCase();
          return (
            (item.description ?? "").toLowerCase().includes(lowerSearch) ||
            item.monthName.toLowerCase().includes(lowerSearch) ||
            item.year.toString().includes(lowerSearch) ||
            searchValue.toLowerCase() === ""
          );
        })
        .sort((a, b) => {
          if (a.year !== b.year) {
            return b.year - a.year;
          }
          return a.monthNum - b.monthNum;
        }) ?? [],
    [props.entries, searchValue],
  );

  const columnHelper = useMemo(() => createColumnHelper<OurWorkEntry>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.monthName} ${row.year}`, {
        cell: (info) => info.getValue(),
        header: "Date",
        id: "date",
      }),
      columnHelper.accessor("imageUrl", {
        cell: (info) => {
          const url = info.getValue();
          return url ? (
            <Image
              alt="Timeline"
              height={50}
              src={url}
              style={{ objectFit: "cover" }}
              width={50}
            />
          ) : (
            <span>No image</span>
          );
        },
        header: "Image",
      }),
      columnHelper.accessor("description", {
        cell: (info) => {
          const desc = info.getValue();
          return desc ? (
            <div
              style={{
                maxWidth: "300px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {desc}
            </div>
          ) : (
            <span>-</span>
          );
        },
        header: "Description",
      }),
      columnHelper.display({
        cell: (info) => (
          <EditOurWorkEntryCell
            currentRow={{
              description: info.row.original.description,
              id: info.row.original.id,
              imageUrl: info.row.original.imageUrl,
              monthName: info.row.original.monthName,
              monthNum: info.row.original.monthNum,
              year: info.row.original.year,
            }}
            currentUser={props.currentUser}
            newEntry={false}
          />
        ),
        id: "edit",
      }),
      columnHelper.display({
        cell: (info) => (
          <DeleteOurWorkEntry
            currentRow={{
              description: info.row.original.description,
              id: info.row.original.id,
              imageUrl: info.row.original.imageUrl,
              monthName: info.row.original.monthName,
              monthNum: info.row.original.monthNum,
              year: info.row.original.year,
            }}
            currentUser={props.currentUser}
          />
        ),
        id: "delete",
      }),
    ],
    [columnHelper, props.currentUser],
  );

  const table = useReactTable({
    columns,
    data: dataToRender,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div id="ourwork">
      <div className={styles.tableHeader}>
        <div>Our Work Timeline</div>
        <div className={styles.tableHeaderSponsorRight}>
          <SearchBar setSearchValue={setSearchValue} value={searchValue} />
          {
            <EditOurWorkEntryCell
              currentRow={{
                description: "",
                id: -1,
                imageUrl: "",
                monthName: "",
                monthNum: 1,
                year: new Date().getFullYear(),
              }}
              currentUser={props.currentUser}
              newEntry
            />
          }
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
    </div>
  );
};

export default memo(OurWorkEntriesTable);
