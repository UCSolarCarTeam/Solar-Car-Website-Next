import { useTransition } from "react";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import { deleteDBUser } from "@/app/portal/_actions/mutations";
import { runPortalAction } from "@/app/portal/_lib/runAction";
import { type UserResource } from "@clerk/nextjs/types";
import type { User } from "@prisma/client";

import BasicButton, { ButtonVariant } from "../../Buttons/BasicButton";

export interface DeleteUserProps {
  currentUser?: UserResource | undefined | null;
  currentRow: Pick<User, "id">;
}

const DeleteUser = ({ currentRow }: DeleteUserProps) => {
  const [, startTransition] = useTransition();

  return (
    <div className={styles.editSponsorCell}>
      <BasicButton
        onConfirmDelete={() => {
          startTransition(() => {
            void runPortalAction(() => deleteDBUser({ id: currentRow.id }), {
              error:
                "There was an error deleting the user. Please contact Telemetry Team.",
              loading: "Deleting...",
              success: "User deleted successfully!",
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

export default DeleteUser;
