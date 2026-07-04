import { Timeline } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

import EntityTable from "../EntityTable";
import { columns } from "./columns";

export type OurWorkEntry = Pick<
  Timeline,
  "id" | "year" | "monthName" | "monthNum" | "imageUrl" | "description"
>;

const OurWorkEntriesTable = ({ entries }: { entries: OurWorkEntry[] }) => {
  return (
    <EntityTable
      columns={columns as ColumnDef<OurWorkEntry>[]}
      data={entries}
      tableHeader={"Our Work Timeline"}
    />
  );
};

export default OurWorkEntriesTable;
