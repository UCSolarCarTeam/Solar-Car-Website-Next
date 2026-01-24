import Image from "next/image";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo, useMemo, useState } from "react";
import toast from "react-hot-toast";

import PlusIcon from "@/app/_components/svgs/PlusIcon";
import { type RouterOutputs, trpc } from "@/trpc/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import BasicButton, { ButtonVariant } from "../../Buttons/BasicButton";
import EditAlumniPopupAdmin from "../EditUserCell/EditAlumniPopupAdmin";
import SearchBar from "../SearchBar";
import styles from "./index.module.scss";

// Helper type for Alumni from the router
export type AlumniMember = RouterOutputs["portal"]["getAlumniList"][number];

const AlumniTable = (props: { alumni: AlumniMember[] }) => {
  const [searchValue, setSearchValue] = useState("");
  const [createPopupOpen, setCreatePopupOpen] = useState(false);

  // State for editing
  const [editingAlumni, setEditingAlumni] = useState<AlumniMember | null>(null);

  const utils = trpc.useUtils();
  const deleteAlumniMutation = trpc.portal.deleteAlumni.useMutation({
    onError: () => {
      toast.error(
        "There was an error deleting the alumni. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getAlumniList.invalidate(), {
        error: (err: Error) =>
          `Failed to delete alumni: ${err?.message || "Unknown error"}`,
        loading: "Deleting...",
        success: "Alumni deleted successfully!",
      });
    },
  });

  const dataToRender = useMemo(
    () =>
      props.alumni.filter((alum) => {
        const lowerSearch = searchValue.toLowerCase();
        return (
          (alum.firstName ?? "").toLowerCase().includes(lowerSearch) ||
          (alum.lastName ?? "").toLowerCase().includes(lowerSearch) ||
          (alum.company ?? "").toLowerCase().includes(lowerSearch) ||
          searchValue.toLowerCase() === ""
        );
      }) ?? [],
    [props.alumni, searchValue],
  );

  const columnHelper = useMemo(() => createColumnHelper<AlumniMember>(), []);
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
        header: () => "Profile",
      }),
      columnHelper.accessor("firstName", {
        cell: (info) => info.getValue(),
        header: "First Name",
      }),
      columnHelper.accessor("lastName", {
        cell: (info) => info.getValue(),
        header: "Last Name",
      }),
      columnHelper.accessor("teamRole", {
        cell: (info) => {
          return (info.getValue() ?? "").replace(/([a-z])([A-Z])/g, "$1 $2");
        },
        header: "Team Role",
      }),
      columnHelper.accessor("company", {
        cell: (info) => info.getValue(),
        header: "Company",
      }),
      columnHelper.accessor("position", {
        cell: (info) => info.getValue(),
        header: "Position",
      }),
      columnHelper.display({
        cell: (info) => {
          const row = info.row.original;
          if (!row.yearJoinedSolarCar && !row.yearLeftSolarCar) return "";
          return `${row.yearJoinedSolarCar ?? "?"} - ${row.yearLeftSolarCar ?? "?"}`;
        },
        header: "Tenure",
      }),
      columnHelper.display({
        cell: (info) => (
          <BasicButton onClick={() => setEditingAlumni(info.row.original)}>
            Edit
          </BasicButton>
        ),
        id: "edit",
      }),
      columnHelper.display({
        cell: (info) => (
          <BasicButton
            onConfirmDelete={() =>
              deleteAlumniMutation.mutate({ id: info.row.original.id })
            }
            variant={ButtonVariant.Delete}
          >
            Delete
          </BasicButton>
        ),
        id: "delete",
      }),
    ],
    [columnHelper, deleteAlumniMutation],
  );

  const table = useReactTable({
    columns,
    data: dataToRender,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div id="alumni">
      <div className={styles.tableHeader}>
        <div>Alumni</div>
        <div className={styles.tableHeaderSponsorRight}>
          <SearchBar setSearchValue={setSearchValue} value={searchValue} />
          <button
            aria-label="Create alumni"
            onClick={() => setCreatePopupOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setCreatePopupOpen(true);
              }
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              padding: 0,
            }}
            type="button"
          >
            <PlusIcon fill="#000000" size="md" />
          </button>
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

      {createPopupOpen && (
        <EditAlumniPopupAdmin togglePopup={() => setCreatePopupOpen(false)} />
      )}

      {editingAlumni && (
        <EditAlumniPopupAdmin
          currentRow={editingAlumni}
          togglePopup={() => setEditingAlumni(null)}
        />
      )}
    </div>
  );
};

export default memo(AlumniTable);
