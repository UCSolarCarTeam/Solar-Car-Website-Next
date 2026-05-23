import { memo } from "react";
import toast from "react-hot-toast";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import { trpc } from "@/trpc/react";
import { type UserResource } from "@clerk/types";

import BasicButton, { ButtonVariant } from "../../Buttons/BasicButton";

export interface DeleteOurWorkEntryProps {
  currentUser: UserResource | undefined | null;
  currentRow: {
    id: number;
    year: number;
    monthNum: number;
    monthName: string;
    description: string | null;
    imageUrl: string | null;
  };
}

const DeleteOurWorkEntry = ({ currentRow }: DeleteOurWorkEntryProps) => {
  const utils = trpc.useUtils();
  const deleteEntryMutation = trpc.portal.deleteOurWorkEntry.useMutation({
    onError: () => {
      toast.error(
        "There was an error deleting the entry. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getOurWorkList.invalidate(), {
        loading: "Deleting...",
        success: "Timeline entry deleted successfully!",
      });
    },
  });

  return (
    <div className={styles.editSponsorCell}>
      <BasicButton
        onConfirmDelete={() =>
          deleteEntryMutation.mutate({ id: currentRow.id })
        }
        variant={ButtonVariant.Delete}
      >
        Delete
      </BasicButton>
    </div>
  );
};

export default memo(DeleteOurWorkEntry);
