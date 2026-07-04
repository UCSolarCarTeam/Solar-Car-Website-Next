import { useTransition } from "react";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import { deleteRecruitmentForm } from "@/app/portal/actions";
import { runPortalAction } from "@/app/portal/_lib/runAction";
import { type UserResource } from "@clerk/nextjs/types";

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
  const [, startTransition] = useTransition();

  return (
    <div className={styles.editSponsorCell}>
      <BasicButton
        onConfirmDelete={() => {
          startTransition(() => {
            void runPortalAction(
              () => deleteRecruitmentForm({ id: currentRow.id }),
              {
                error:
                  "There was an error deleting the form. Please contact Telemetry Team.",
                loading: "Deleting...",
                success: "Form deleted successfully!",
              },
            );
          });
        }}
        variant={ButtonVariant.Delete}
      >
        Delete
      </BasicButton>
    </div>
  );
};

export default DeleteForm;
