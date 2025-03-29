import Image from "next/image";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo, useMemo, useState } from "react";

import EditTeamCell from "@/app/_components/EditUserCell";
import { type RouterOutputs } from "@/trpc/react";
import { type UserResource } from "@clerk/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import DeleteUser from "../EditUserCell/DeleteUser";
import SearchBar from "../SearchBar";
import styles from "./index.module.scss";

export type TeamMember = RouterOutputs["portal"]["getDBUsers"][number];

const TeamTable = (props: {
  users: TeamMember[];
  currentUser: UserResource | undefined | null;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const dataToRender = useMemo(
    () =>
      props.users.filter((user) => {
        const lowerSearch = searchValue.toLowerCase();
        return (
          (user.firstName ?? "").toLowerCase().includes(lowerSearch) ||
          (user.lastName ?? "").toLowerCase().includes(lowerSearch) ||
          searchValue.toLowerCase() === ""
        );
      }) ?? [],
    [props.users, searchValue],
  );
  const columnHelper = useMemo(() => createColumnHelper<TeamMember>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("profilePictureUrl", {
        cell: (info) => {
          return (
            <Image
              alt="profile image"
              fill
              loading="eager"
              priority
              src={info.getValue() ?? defaultProfilePicture}
              style={{ objectFit: "cover" }}
            />
          );
        },
        header: () => "Profile Picture",
      }),
      columnHelper.accessor("firstName", {
        cell: (info) => info.getValue(),
        header: "First Name",
      }),
      columnHelper.accessor("lastName", {
        cell: (info) => info.getValue(),
        header: "Last Name",
      }),
      columnHelper.accessor("ucid", {
        cell: (info) => info.getValue(),
        header: "UCID",
      }),
      columnHelper.accessor("schoolEmail", {
        cell: (info) => info.getValue(),
        header: "School Email",
      }),
      columnHelper.accessor("phoneNumber", {
        cell: (info) => info.getValue(),
        header: "Phone Number",
      }),
      // columnHelper.accessor("fieldOfStudy", {
      //   cell: (info) => info.getValue(),
      //   header: "Field of Study",
      // }),
      columnHelper.accessor("teamRole", {
        cell: (info) => {
          return (info.getValue() ?? "").replace(/([a-z])([A-Z])/g, "$1 $2");
        },
        header: "Team Role",
      }),
      // columnHelper.accessor("schoolYear", {
      //   cell: (info) => info.getValue(),
      //   header: "School Year",
      // }),
      // columnHelper.accessor("yearJoined", {
      //   header: "Year Joined",
      // }),
      // columnHelper.accessor("description", {
      //   cell: (info) => info.getValue(),
      //   header: "Description",
      // }),
      columnHelper.display({
        cell: (info) => (
          <EditTeamCell
            currentRow={info.row.original}
            currentUser={props.currentUser}
          />
        ),
        id: "edit",
      }),
      columnHelper.display({
        cell: (info) => (
          <DeleteUser
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
        delete: ["admin", "business"].includes(
          (props.currentUser?.publicMetadata.role as string) ?? "",
        ),
      },
    },
  });

  return (
    <div id="team">
      <div className={styles.tableHeader}>
        <div>Team Members</div>
        <SearchBar setSearchValue={setSearchValue} value={searchValue} />
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

export default memo(TeamTable);
