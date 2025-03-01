import { memo } from "react";

import styles from "@/components/EditSponsorCell/index.module.scss";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";

export interface DeleteSponsorProps {
  currentRow: {
    id: number;
    name: string;
    description: string | null;
    websiteUrl: string;
    logoUrl: string;
  };
}

const DeleteSponsor = ({ currentRow }: DeleteSponsorProps) => {
  const { user } = useUser();
  const utils = api.useUtils();
  const deleteSponsorMutation = api.portal.deleteSponsor.useMutation({
    onSuccess: async () => {
      await utils.portal.getSponsorsList.invalidate();
    },
  });
  if (
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.role === "business"
  ) {
    return (
      <div className={styles.editSponsorCell}>
        <span onClick={() => deleteSponsorMutation.mutate(currentRow.id)}>
          Delete
        </span>
      </div>
    );
  }
};

export default memo(DeleteSponsor);
