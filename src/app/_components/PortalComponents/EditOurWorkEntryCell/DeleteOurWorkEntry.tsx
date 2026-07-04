import { useTransition } from "react";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import { deleteOurWorkEntry } from "@/app/portal/_actions/mutations";
import { runPortalAction } from "@/app/portal/_lib/runAction";

import BasicButton, { ButtonVariant } from "../../Buttons/BasicButton";

export interface DeleteOurWorkEntryProps {
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
  const [, startTransition] = useTransition();

  return (
    <div className={styles.editSponsorCell}>
      <BasicButton
        onConfirmDelete={() => {
          startTransition(() => {
            void runPortalAction(
              () => deleteOurWorkEntry({ id: currentRow.id }),
              {
                error:
                  "There was an error deleting the entry. Please contact Telemetry Team.",
                loading: "Deleting...",
                success: "Timeline entry deleted successfully!",
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

export default DeleteOurWorkEntry;
