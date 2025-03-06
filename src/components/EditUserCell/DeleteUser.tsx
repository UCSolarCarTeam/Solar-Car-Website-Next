import { memo } from "react";

import styles from "@/components/EditSponsorCell/index.module.scss";
import { api } from "@/utils/api";
import { type UserResource } from "@clerk/types";
import { type AllTeamRoles } from "@prisma/client";

import BasicButton from "../Buttons/BasicButton";

export interface DeleteUserProps {
  currentUser: UserResource | undefined | null;
  currentRow: {
    description: string | null;
    id: number;
    clerkUserId: string;
    firstName: string | null;
    lastName: string | null;
    fieldOfStudy: string | null;
    teamRole: AllTeamRoles | null;
    schoolYear: string | null;
    yearJoined: string | null;
    profilePictureUrl: string | null;
    phoneNumber: string | null;
    schoolEmail: string | null;
    ucid: number | null;
  };
}

const DeleteUser = ({ currentRow, currentUser }: DeleteUserProps) => {
  const utils = api.useUtils();
  const deleteSponsorMutation = api.portal.deleteSponsor.useMutation({
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

export default memo(DeleteUser);
