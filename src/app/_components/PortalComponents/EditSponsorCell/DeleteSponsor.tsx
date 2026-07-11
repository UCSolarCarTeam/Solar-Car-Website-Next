import { useTransition } from "react";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import { runPortalAction } from "@/app/portal/_lib/runAction";
import { deleteSponsor } from "@/app/portal/actions";

import BasicButton, { ButtonVariant } from "../../Buttons/BasicButton";

interface DeleteSponsorProps {
  currentRow: {
    id: number;
    name: string;
    description: string | null;
    websiteUrl: string;
    logoUrl: string;
  };
}

const DeleteSponsor = ({ currentRow }: DeleteSponsorProps) => {
  const [, startTransition] = useTransition();

  return (
    <div className={styles.editSponsorCell}>
      <BasicButton
        onConfirmDelete={() => {
          startTransition(() => {
            void runPortalAction(() => deleteSponsor({ id: currentRow.id }), {
              error:
                "There was an error deleting the sponsor. Please contact Telemetry Team.",
              loading: "Deleting...",
              success: "Sponsor deleted successfully!",
            });
          });
        }}
        variant={ButtonVariant.Delete}
      >
        Delete
      </BasicButton>
    </div>
  );
};

export default DeleteSponsor;
