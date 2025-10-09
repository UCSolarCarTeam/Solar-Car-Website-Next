import { memo } from "react";
import toast from "react-hot-toast";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import { trpc } from "@/trpc/react";
import { type UserResource } from "@clerk/types";

import BasicButton, { ButtonVariant } from "../../Buttons/BasicButton";

export interface DeleteSponsorProps {
  currentUser: UserResource | undefined | null;
  currentRow: {
    id: number;
    name: string;
    description: string | null;
    websiteUrl: string;
    logoUrl: string;
  };
}

const DeleteSponsor = ({ currentRow }: DeleteSponsorProps) => {
  const utils = trpc.useUtils();
  const deleteSponsorMutation = trpc.portal.deleteSponsor.useMutation({
    onError: () => {
      toast.error(
        "There was an error deleting the sponsor. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getSponsorsList.invalidate(), {
        loading: "Deleting...",
        success: "Sponsor deleted successfully!",
      });
    },
  });

  return (
    <div className={styles.editSponsorCell}>
      <BasicButton
        onConfirmDelete={() =>
          deleteSponsorMutation.mutate({ id: currentRow.id })
        }
        variant={ButtonVariant.Delete}
      >
        Delete
      </BasicButton>
    </div>
  );
};

export default memo(DeleteSponsor);
