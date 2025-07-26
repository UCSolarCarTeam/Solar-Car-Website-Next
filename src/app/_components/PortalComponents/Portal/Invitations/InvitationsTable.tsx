import { useMemo, useState } from "react";
import { memo } from "react";

import InviteUser from "@/app/_components/PortalComponents/Portal/Invitations/InviteUser";
import RevokeUserCell from "@/app/_components/PortalComponents/Portal/Invitations/RevokeUserCell";
import SearchBar from "@/app/_components/PortalComponents/SearchBar";
import { type RouterOutputs } from "@/trpc/react";
import { type UserResource } from "@clerk/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "../index.module.scss";

type Invitation = RouterOutputs["portal"]["getInvitedUsers"][number];

const InvitationsTable = (props: {
  invitations: Invitation[];
  currentUser: UserResource | undefined | null;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const dataToRender = useMemo(
    () =>
      props.invitations.filter((invitation) => {
        const lowerSearch = searchValue.toLowerCase();
        return (
          (invitation.email ?? "").toLowerCase().includes(lowerSearch) ||
          (invitation.status ?? "").toLowerCase().includes(lowerSearch) ||
          searchValue.toLowerCase() === ""
        );
      }) ?? [],
    [props.invitations, searchValue],
  );

  const columnHelper = useMemo(() => createColumnHelper<Invitation>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("email", {
        cell: (info) => info.getValue(),
        header: "Email",
      }),
      columnHelper.accessor("createdAt", {
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
        header: "Invited At",
      }),
      columnHelper.accessor("status", {
        cell: (info) => info.getValue().toLocaleUpperCase(),
        header: "Status",
      }),
      columnHelper.display({
        cell: (info) => {
          const status = info.row.original.status?.toLowerCase();
          if (status === "accepted") {
            return null;
          }
          return <RevokeUserCell invitationId={info.row.original.id} />;
        },
        header: () => null,
        id: "revoke",
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    columns,
    data: dataToRender,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div id="inivitations">
      <div className={styles.inviteUserContainer}>
        <div>Invite a User</div>
        <InviteUser />
      </div>
      <div className={styles.tableHeader}>
        <div>Portal Invitations</div>
        <SearchBar setSearchValue={setSearchValue} value={searchValue} />
      </div>
      <div className={styles.tableContainer}>
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
        {dataToRender.length === 0 && (
          <div className={styles.noResults}>No Results Found</div>
        )}
      </div>
    </div>
  );
};

export default memo(InvitationsTable);
