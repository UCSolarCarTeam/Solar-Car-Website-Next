import { memo } from "react";

import styles from "@/app/_components/EditSponsorCell/index.module.scss";
import { trpc } from "@/trpc/react";
import { type UserResource } from "@clerk/types";

import BasicButton from "../Buttons/BasicButton";

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

const DeleteSponsor = ({ currentRow, currentUser }: DeleteSponsorProps) => {
  const utils = trpc.useUtils();
  const deleteSponsorMutation = trpc.portal.deleteSponsor.useMutation({
    onSuccess: async () => {
      await utils.portal.getSponsorsList.invalidate();
    },
  });

  if (
    currentUser?.publicMetadata?.role === "admin" ||
    currentUser?.publicMetadata?.role === "business"
  ) {
    return (
      <div className={styles.editSponsorCell}>
        <BasicButton
          onClick={() => deleteSponsorMutation.mutate(currentRow.id)}
          style={{ backgroundColor: "#DC676C" }}
        >
          Delete
        </BasicButton>
      </div>
    );
  }
};

export default memo(DeleteSponsor);
