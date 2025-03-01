import { memo } from "react";

import styles from "@/components/EditSponsorCell/index.module.scss";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";

import BasicButton from "../Buttons/BasicButton";

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
