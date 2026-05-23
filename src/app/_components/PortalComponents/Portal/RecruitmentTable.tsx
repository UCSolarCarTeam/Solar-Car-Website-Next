import { memo, useMemo, useState } from "react";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import EditRecruitmentFormCell from "@/app/_components/PortalComponents/EditRecruitmentFormCell";
import styles from "@/app/_components/PortalComponents/Portal/index.module.scss";
import SearchBar from "@/app/_components/PortalComponents/SearchBar";
import { toLocalDateTimeString } from "@/app/_lib/toLocalDate";
import { type UserResource } from "@clerk/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import DeleteForm from "../EditRecruitmentFormCell/DeleteForm";

export type RecruitmentForm = {
  id: number;
  header: string;
  description: string;
  link: string;
  expiresAt: Date;
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

  const columnHelper = useMemo(() => createColumnHelper<RecruitmentForm>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("header", {
        cell: (info) => info.getValue(),
        header: "Header",
      }),
      columnHelper.accessor("description", {
        cell: (info) => info.getValue(),
        header: "Description",
      }),
      columnHelper.accessor("link", {
        cell: (info) => (
          <a href={info.getValue()} rel="noopener noreferrer" target="_blank">
            <BasicButton>Go to Form</BasicButton>
          </a>
        ),
        header: "Link",
      }),
      columnHelper.accessor("expiresAt", {
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString() + " " + date.toLocaleTimeString();
        },
        header: "Expires At",
      }),
      columnHelper.display({
        cell: (info) => (
          <EditRecruitmentFormCell
            currentRow={{
              ...info.row.original,
              description: info.row.original.description,
              expiresAt: toLocalDateTimeString(info.row.original.expiresAt),
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
              expiresAt: toLocalDateTimeString(info.row.original.expiresAt),
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
  });

  return (
    <div id="sponsors">
      <div className={styles.tableHeader}>
        <div>Recruitment</div>
        <div className={styles.tableHeaderSponsorRight}>
          <SearchBar setSearchValue={setSearchValue} value={searchValue} />
          {
            <EditRecruitmentFormCell
              currentRow={{
                id: -1,
                // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
                header: "",
                // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
                description: "",
                link: "",
                // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
                expiresAt: "",
              }}
              currentUser={props.currentUser}
              newForm
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

export default memo(RecruitmentTable);
