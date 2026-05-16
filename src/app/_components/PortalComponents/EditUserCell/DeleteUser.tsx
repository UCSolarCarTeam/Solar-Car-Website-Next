import { memo } from "react";
import toast from "react-hot-toast";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import { trpc } from "@/trpc/react";
import { type UserResource } from "@clerk/nextjs/types";
import type { User } from "@prisma/client";

import BasicButton, { ButtonVariant } from "../../Buttons/BasicButton";

export interface DeleteUserProps {
  currentUser: UserResource | undefined | null;
  currentRow: Pick<User, "id">;
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
        onConfirmDelete={() => deleteUserMutation.mutate({ id: currentRow.id })}
        variant={ButtonVariant.Delete}
      >
        Delete
      </BasicButton>
    </div>
  );
};

export default memo(DeleteUser);
