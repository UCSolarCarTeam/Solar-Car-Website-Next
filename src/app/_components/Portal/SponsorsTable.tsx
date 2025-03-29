import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";

import styles from "@/app/_components/Portal/index.module.scss";
import { type RouterOutputs } from "@/trpc/react";
import { type UserResource } from "@clerk/types";
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
import SearchBar from "../SearchBar";

export type Sponsor = RouterOutputs["portal"]["getSponsorsList"][number];

const SponsorsTable = (props: {
  sponsors: Sponsor[];
  currentUser: UserResource | undefined | null;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const dataToRender = useMemo(
    () =>
      props.sponsors.filter((sponsor) => {
        const lowerSearch = searchValue.toLowerCase();
        return (
          (sponsor.name ?? "").toLowerCase().includes(lowerSearch) ||
          (sponsor.description ?? "").toLowerCase().includes(lowerSearch) ||
          searchValue.toLowerCase() === ""
        );
      }) ?? [],
    [props.sponsors, searchValue],
  );

  const shouldShowAdminButtons = useMemo(
    () =>
      ["admin", "business"].includes(
        (props.currentUser?.publicMetadata?.role as string) ?? "",
      ),
    [props.currentUser?.publicMetadata?.role],
  );
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
          <EditSponsorCell
            currentRow={info.row.original}
            currentUser={props.currentUser}
            newSponsor={false}
          />
        ),
        id: "edit",
      }),
      columnHelper.display({
        cell: (info) => (
          <DeleteSponsor
            currentRow={info.row.original}
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
    initialState: {
      columnVisibility: {
        delete: shouldShowAdminButtons,
        edit: shouldShowAdminButtons,
      },
    },
  });

  return (
    <div id="sponsors">
      <div className={styles.tableHeader}>
        <div>Sponsors</div>
        <div className={styles.tableHeaderSponsorRight}>
          <SearchBar setSearchValue={setSearchValue} value={searchValue} />
          {shouldShowAdminButtons && (
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
              currentUser={props.currentUser}
              newSponsor
            />
          )}
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

export default memo(SponsorsTable);
