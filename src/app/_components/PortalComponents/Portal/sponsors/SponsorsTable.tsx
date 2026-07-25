"use client";

import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { useUser } from "@/app/_hooks/useUser";
import type { Sponsor } from "@/generated/prisma/browser";

import EntityTable from "../EntityTable";
import { columns } from "./columns";

export type { Sponsor };

const SponsorsTable = ({ sponsors }: { sponsors: Sponsor[] }) => {
  const { user } = useUser();
  const shouldShowAdminButtons = ["admin", "business"].includes(
    user?.publicMetadata?.role ?? "",
  );
  const initialVisibility: VisibilityState = {
    delete: shouldShowAdminButtons,
    edit: shouldShowAdminButtons,
  };

  return (
    <EntityTable
      columns={columns as ColumnDef<Sponsor, unknown>[]}
      data={sponsors}
      initialVisibility={initialVisibility}
      tableHeader={"Sponsors"}
    />
  );
};

export default SponsorsTable;
