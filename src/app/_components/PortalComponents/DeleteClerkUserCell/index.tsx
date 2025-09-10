import { memo, useState } from "react";
import toast from "react-hot-toast";

import styles from "@/app/_components/PortalComponents/DeleteClerkUserCell/index.module.scss";
import { trpc } from "@/trpc/react";

import BasicButton from "../../Buttons/BasicButton";
import ConfirmModal from "../../Modals/ConfirmModal";

export interface DeleteClerkUserProps {
  clerkId: string;
}

const DeleteClerkUser = ({ clerkId }: DeleteClerkUserProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const utils = trpc.useUtils();
  const deleteUser = trpc.portal.deleteClerkUser.useMutation({
    onError: () => {
      toast.error(
        "There was an error deleting the clerk user. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getClerkUsers.invalidate(), {
        loading: "Deleting...",
        success: "Clerk user deleted successfully!",
      });
    },
  });

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
          deleteUser.mutate({ clerkId });
          setShowConfirm(false);
        }}
        open={showConfirm}
        title="Delete Clerk User"
      />
    </div>
  );
};

export default memo(DeleteClerkUser);
