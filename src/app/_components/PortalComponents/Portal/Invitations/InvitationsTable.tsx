"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import InviteUser from "@/app/_components/PortalComponents/Portal/Invitations/InviteUser";
import RevokeUserCell from "@/app/_components/PortalComponents/Portal/Invitations/RevokeUserCell";
import SearchBar from "@/app/_components/PortalComponents/SearchBar";
import type { PortalInvitation } from "@/server/portal/types";

import PortalTableContainer from "../PortalTableContainer";

const columnHelper = createColumnHelper<PortalInvitation>();

const columns = [
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
      if (status === "accepted" || status === "revoked") {
        return null;
      }
      return <RevokeUserCell invitationId={info.row.original.id} />;
    },
    header: () => null,
    id: "revoke",
  }),
];

const InvitationsTable = (props: { invitations: PortalInvitation[] }) => {
  const [searchValue, setSearchValue] = useState("");
  // TanStack resets its state when data changes, so keep this reference stable.
  const dataToRender = useMemo(() => {
    const lowerSearch = searchValue.toLowerCase();
    return props.invitations.filter((invitation) => {
      return (
        (invitation.email ?? "").toLowerCase().includes(lowerSearch) ||
        (invitation.status ?? "").toLowerCase().includes(lowerSearch) ||
        lowerSearch === ""
      );
    });
  }, [props.invitations, searchValue]);

  const table = useReactTable({
    columns,
    data: dataToRender,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div id="inivitations">
      <div className="my-4 flex flex-col text-[1.2rem] font-[650]">
        <div>Invite a User</div>
        <InviteUser />
      </div>
      <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-4 text-[1.2rem] font-semibold text-[#1f2937] [@media(max-width:768px)]:items-start [@media(max-width:768px)]:text-base">
        <div>Portal Invitations</div>
        <SearchBar setSearchValue={setSearchValue} value={searchValue} />
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
        {dataToRender.length === 0 && (
          <div className="py-1.25 text-center">No Results Found</div>
        )}
      </PortalTableContainer>
    </div>
  );
};

export default InvitationsTable;
