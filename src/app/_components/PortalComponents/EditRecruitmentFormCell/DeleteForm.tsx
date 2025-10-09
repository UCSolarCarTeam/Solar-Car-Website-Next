import { memo } from "react";
import toast from "react-hot-toast";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import { trpc } from "@/trpc/react";
import { type UserResource } from "@clerk/types";

import BasicButton, { ButtonVariant } from "../../Buttons/BasicButton";

export interface DeleteFormProps {
  currentUser: UserResource | undefined | null;
  currentRow: {
    id: number;
    header: string;
    description: string;
    link: string;
    expiresAt: string;
  };
}

const DeleteForm = ({ currentRow }: DeleteFormProps) => {
  const utils = trpc.useUtils();
  const deleteFormMutation = trpc.portal.deleteRecruitmentForm.useMutation({
    onError: () => {
      toast.error(
        "There was an error deleting the form. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getFormsList.invalidate(), {
        loading: "Deleting...",
        success: "Form deleted successfully!",
      });
    },
  });

  return (
    <div className={styles.editSponsorCell}>
      <BasicButton
        onConfirmDelete={() => deleteFormMutation.mutate({ id: currentRow.id })}
        variant={ButtonVariant.Delete}
      >
        Delete
      </BasicButton>
    </div>
  );
};

export default memo(DeleteForm);
