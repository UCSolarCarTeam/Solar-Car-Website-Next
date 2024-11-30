import { useEffect, useState } from "react";

import { type TeamMember } from "@/pages/portal/TeamTable";
import { type CellContext } from "@tanstack/react-table";

const EditableTableCell = ({
  column,
  getValue,
  row,
  table,
}: CellContext<TeamMember, unknown>) => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value);
  };

  if (tableMeta?.rowsBeingEdited[row.id]) {
    return (
      <input
        onBlur={onBlur}
        onChange={(e) => setValue(e.target.value)}
        type={columnMeta?.type ?? "text"}
        value={value as string}
      />
    );
  }
  return <span>{value as string}</span>;
};

export default EditableTableCell;
