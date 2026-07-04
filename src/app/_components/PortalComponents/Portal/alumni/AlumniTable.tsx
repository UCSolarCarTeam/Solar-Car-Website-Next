"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { type RouterOutputs, trpc } from "@/trpc/react";
import { ColumnDef } from "@tanstack/react-table";

import EditAlumniPopupAdmin from "../../EditUserCell/EditAlumniPopupAdmin";
import EntityTable from "../EntityTable";
import { columns } from "./columns";

// Helper type for Alumni from the router
export type AlumniMember = RouterOutputs["portal"]["getAlumniList"][number];

const AlumniTable = ({ alumni: data }: { alumni: AlumniMember[] }) => {
  const [createPopupOpen, setCreatePopupOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<AlumniMember | null>(null);

  const utils = trpc.useUtils();
  const deleteDBUserMutation = trpc.portal.deleteDBUser.useMutation({
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

  const alumniColumns = columns(
    (alumni) => setEditingAlumni(alumni),
    (id) => deleteDBUserMutation.mutate({ id }),
  );
  return (
    <EntityTable
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
      columns={alumniColumns as ColumnDef<AlumniMember, unknown>[]}
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
