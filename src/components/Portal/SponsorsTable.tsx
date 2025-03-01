import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";

import styles from "@/components/Portal/index.module.scss";
import { type RouterOutputs } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { SponsorLevel } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import EditSponsorPopup from "../EditSponsorCell";
import EditSponsorCell from "../EditSponsorCell";
import DeleteSponsor from "../EditSponsorCell/DeleteSponsor";

export type Sponsor = RouterOutputs["portal"]["getSponsorsList"][number];

const SponsorsTable = (props: { sponsors: Sponsor[] }) => {
  const { user } = useUser();
  const columnHelper = useMemo(() => createColumnHelper<Sponsor>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("logoUrl", {
        cell: (info) => (
          <Image
            alt="sponsor logo"
            fill
            loading="eager"
            priority
            src={info.getValue()}
            style={{ objectFit: "cover" }}
          />
        ),
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
        cell: (info) => (
          <Link href={info.getValue()} prefetch={false}>
            {info.getValue()}
          </Link>
        ),
        header: "Website",
      }),
      columnHelper.accessor("sponsorLevel", {
        cell: (info) => info.getValue(),
        header: "Sponsor Level",
      }),
      columnHelper.display({
        cell: (info) => (
          <EditSponsorCell currentRow={info.row.original} newSponsor={false} />
        ),
        id: "edit",
      }),
      columnHelper.display({
        cell: (info) => <DeleteSponsor currentRow={info.row.original} />,
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
    data: props.sponsors ?? [],
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
      <div className={styles.tableHeader}>
        Sponsors
        <EditSponsorPopup
          currentRow={{
            name: "",
            // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
            description: "",
            websiteUrl: "",
            // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
            sponsorLevel: SponsorLevel.Gold,
            // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
            logoUrl: "",
            // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
            id: -1,
          }}
          newSponsor
        />
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

export default memo(SponsorsTable);
