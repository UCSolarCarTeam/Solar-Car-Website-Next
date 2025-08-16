import Link from "next/link";
import { memo, useMemo, useState } from "react";

import EditSponsorCell from "@/app/_components/PortalComponents/EditSponsorCell";
import styles from "@/app/_components/PortalComponents/Portal/index.module.scss";
import SearchBar from "@/app/_components/PortalComponents/SearchBar";
import { type UserResource } from "@clerk/types";
import { SponsorLevel } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import EditRecruitmentFormCell from "../EditRecruitmentFormCell";
import DeleteForm from "../EditRecruitmentFormCell/DeleteForm";

export type RecruitmentForm = {
  id: number;
  header: string;
  description: string;
  link: string;
};

const RecruitmentTable = (props: {
  forms: RecruitmentForm[];
  currentUser: UserResource | undefined | null;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const dataToRender = useMemo(
    () =>
      (props.forms ?? []).filter((item) => {
        const lowerSearch = searchValue.toLowerCase();
        return (
          (item.header ?? "").toLowerCase().includes(lowerSearch) ||
          (item.description ?? "").toLowerCase().includes(lowerSearch) ||
          searchValue.toLowerCase() === ""
        );
      }) ?? [],
    [props.forms, searchValue],
  );

  // const shouldShowAdminButtons = useMemo(
  //   () =>
  //     ["admin", "business"].includes(
  //       (props.currentUser?.publicMetadata?.role as string) ?? "",
  //     ),
  //   [props.currentUser?.publicMetadata?.role],
  // );

  // use that later

  const columnHelper = useMemo(() => createColumnHelper<RecruitmentForm>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("header", {
        cell: (info) => info.getValue(),
        header: "Header",
      }),
      columnHelper.accessor("description", {
        cell: (info) => info.getValue(),
        header: "Body",
      }),
      columnHelper.accessor("link", {
        cell: (info) => (
          <Link href={info.getValue()} prefetch={false}>
            {info.getValue()}
          </Link>
        ),
        header: "Link",
      }),
      columnHelper.display({
        cell: (info) => (
          <EditRecruitmentFormCell
            currentRow={{
              ...info.row.original,
              description: info.row.original.description,
              header: info.row.original.header,
              link: info.row.original.link,
            }}
            currentUser={props.currentUser}
            newForm={false}
          />
        ),
        id: "edit",
      }),
      columnHelper.display({
        cell: (info) => (
          <DeleteForm
            currentRow={{
              ...info.row.original,
              description: info.row.original.description,
              header: info.row.original.header,
              link: info.row.original.link,
            }}
            currentUser={undefined}
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
        // delete: shouldShowAdminButtons,
        // edit: shouldShowAdminButtons,
      },
    },
  });

  return (
    <div id="sponsors">
      <div className={styles.tableHeader}>
        <div>Recruitment</div>
        <div className={styles.tableHeaderSponsorRight}>
          <SearchBar setSearchValue={setSearchValue} value={searchValue} />
          {
            /*shouldShowAdminButtons*/ 0 && (
              <EditSponsorCell
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
            )
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

export default memo(RecruitmentTable);
