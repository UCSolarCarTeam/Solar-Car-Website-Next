"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { runPortalAction } from "@/app/portal/_lib/runAction";
import { deleteDBUser } from "@/app/portal/actions";
import type { User } from "@/generated/prisma/browser";

import EditAlumniPopupAdmin from "../../EditUserCell/EditAlumniPopupAdmin";
import EntityTable from "../EntityTable";
import { columns } from "./columns";

export type AlumniMember = User;

const AlumniTable = ({ alumni: data }: { alumni: AlumniMember[] }) => {
  const [createPopupOpen, setCreatePopupOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<AlumniMember | null>(null);
  const [, startTransition] = useTransition();

  const handleDelete = (id: number) => {
    startTransition(() => {
      void runPortalAction(() => deleteDBUser({ id }), {
        error:
          "There was an error deleting the alumni. Please contact Telemetry Team.",
        loading: "Deleting...",
        success: "Alumni deleted successfully!",
      });
    });
  };

  const alumniColumns = columns(
    (alumni) => setEditingAlumni(alumni),
    handleDelete,
  );

  return (
    <EntityTable
      columns={alumniColumns as ColumnDef<AlumniMember, unknown>[]}
      data={data}
      tableHeader={
        <div className="flex items-center gap-2 justify-between">
          <h2 className="text-lg font-semibold">Alumni</h2>
          <PlusIcon
            className="cursor-pointer"
            onClick={() => setCreatePopupOpen(true)}
            size={20}
          />
        </div>
      }
    >
      {createPopupOpen && (
        <EditAlumniPopupAdmin togglePopup={() => setCreatePopupOpen(false)} />
      )}

      {editingAlumni && (
        <EditAlumniPopupAdmin
          currentRow={editingAlumni}
          togglePopup={() => setEditingAlumni(null)}
        />
      )}
    </EntityTable>
  );
};

export default AlumniTable;
