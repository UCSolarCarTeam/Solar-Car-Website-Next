import { useTransition } from "react";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import styles from "@/app/_components/PortalComponents/DeleteClerkUserCell/index.module.scss";
import { runPortalAction } from "@/app/portal/_lib/runAction";
import { revokeUserInvitation } from "@/app/portal/actions";

export interface RevokeUserInvitationProps {
  invitationId: string;
}

const RevokeUserCell = ({ invitationId }: RevokeUserInvitationProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={styles.deleteClerkUserCell}>
      <BasicButton
        className="bg-destructive"
        disabled={isPending}
        onClick={(e) => {
          e.stopPropagation();
          startTransition(async () => {
            await runPortalAction(
              () => revokeUserInvitation({ invitationId }),
              {
                error:
                  "There was an error revoking the user's invitation. Please contact Telemetry Team.",
                loading: "Revoking...",
                success: "Invitation revoked successfully!",
              },
            );
          });
        }}
      >
        {isPending ? "Revoking..." : "Revoke Invitation"}
      </BasicButton>
    </div>
  );
};

export default RevokeUserCell;
