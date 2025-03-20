import { memo } from "react";
import toast from "react-hot-toast";

import styles from "@/app/_components/EditSponsorCell/index.module.scss";
import { trpc } from "@/trpc/react";
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

const DeleteUser = ({ currentRow }: DeleteUserProps) => {
  const utils = trpc.useUtils();
  const deleteUserMutation = trpc.portal.deleteDBUser.useMutation({
    onError: () => {
      toast.error(
        "There was an error deleting the user. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getDBUsers.invalidate(), {
        loading: "Deleting...",
        success: "User deleted successfully!",
      });
    },
  });

  return (
    <div className={styles.editSponsorCell}>
      <BasicButton
        onClick={() => deleteUserMutation.mutate({ id: currentRow.id })}
        style={{ backgroundColor: "#DC676C" }}
      >
        Delete
      </BasicButton>
    </div>
  );
};

export default memo(DeleteUser);
