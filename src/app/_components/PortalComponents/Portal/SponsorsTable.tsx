import { useUser } from "@/app/_hooks/useUser";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, type VisibilityState } from "@tanstack/react-table";

import EntityTable from "./EntityTable";
import { columns } from "./sponsors/columns";

export type Sponsor = RouterOutputs["portal"]["getSponsorsList"][number];

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
