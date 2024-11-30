import { type TeamMember } from "@/pages/portal/TeamTable";
import { type CellContext } from "@tanstack/react-table";

const EditCell = ({ row, table }: CellContext<TeamMember, unknown>) => {
  const meta = table.options.meta;

  const setEditedRows = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const elName = event.currentTarget?.name;
    meta?.setRowsBeingEdited((prev) => ({
      ...prev,
      [row.id]: !prev[row.id],
    }));
    if (elName === "done") {
      console.log("here");
    }
  };

  return (
    <div className="edit-cell-container">
      {meta?.rowsBeingEdited[row.id] ? (
        <div className="edit-cell">
          <button name="cancel" onClick={setEditedRows}>
            Cancel
          </button>
          <button name="done" onClick={setEditedRows}>
            Done
          </button>
        </div>
      ) : (
        <button name="edit" onClick={setEditedRows}>
          Edit
        </button>
      )}
    </div>
  );
};

export default EditCell;
