import Image from "next/image";
import { memo, useMemo } from "react";

import styles from "@/components/Portal/index.module.scss";
import { type RouterOutputs } from "@/utils/api";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export type Sponsor = RouterOutputs["portal"]["getSponsorsList"][number];

const SponsorsTable = (props: { sponsors: Sponsor[] }) => {
  const columnHelper = useMemo(() => createColumnHelper<Sponsor>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("logoUrl", {
        cell: (info) => <Image alt="sponsor logo" src={info.getValue()} />,
        header: "Logo",
      }),
      columnHelper.accessor("name", {
        cell: (info) => info.getValue(),
        header: "Name",
      }),
      columnHelper.accessor("description", {
        cell: (info) => info.getValue(),
        header: "Description",
      }),
      columnHelper.accessor("websiteUrl", {
        cell: (info) => info.getValue(),
        header: "Website",
      }),
    ],
    [columnHelper],
  );
  const table = useReactTable({
    columns,
    data: props.sponsors ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      Sponsors
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
  );
};

export default memo(SponsorsTable);
