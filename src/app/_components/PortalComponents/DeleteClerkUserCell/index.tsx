import { useState, useTransition } from "react";

import styles from "@/app/_components/PortalComponents/DeleteClerkUserCell/index.module.scss";
import { deleteClerkUser } from "@/app/portal/_actions/mutations";
import { runPortalAction } from "@/app/portal/_lib/runAction";

import BasicButton from "../../Buttons/BasicButton";
import ConfirmModal from "../../Modals/ConfirmModal";

export interface DeleteClerkUserProps {
  clerkId: string;
}

const DeleteClerkUser = ({ clerkId }: DeleteClerkUserProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [, startTransition] = useTransition();

  return (
    <div
      className={styles.deleteClerkUserCell}
      onClick={(e) => e.stopPropagation()}
    >
      <BasicButton
        onClick={() => setShowConfirm(true)}
        style={{ backgroundColor: "#DC676C" }}
      >
        Delete
      </BasicButton>

      <ConfirmModal
        cancelText="Cancel"
        confirmText="Yes, Delete"
        message="Are you sure you want to delete this clerk user?"
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          startTransition(() => {
            void runPortalAction(() => deleteClerkUser({ clerkId }), {
              error:
                "There was an error deleting the clerk user. Please contact Telemetry Team.",
              loading: "Deleting...",
              success: "Clerk user deleted successfully!",
            });
          });
          setShowConfirm(false);
        }}
        open={showConfirm}
        title="Delete Clerk User"
      />
    </div>
  );
};

export default DeleteClerkUser;
