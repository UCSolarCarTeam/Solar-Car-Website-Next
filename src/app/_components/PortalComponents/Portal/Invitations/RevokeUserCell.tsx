import { useTransition } from "react";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import styles from "@/app/_components/PortalComponents/DeleteClerkUserCell/index.module.scss";
import { revokeUserInvitation } from "@/app/portal/actions";
import { runPortalAction } from "@/app/portal/_lib/runAction";

export interface RevokeUserInvitationProps {
  invitationId: string;
}

const RevokeUserCell = ({ invitationId }: RevokeUserInvitationProps) => {
  const [, startTransition] = useTransition();

  return (
    <div
      className={styles.deleteClerkUserCell}
      onClick={(e) => {
        e.stopPropagation();
        startTransition(() => {
          void runPortalAction(() => revokeUserInvitation({ invitationId }), {
            error:
              "There was an error revoking the user's invitation. Please contact Telemetry Team.",
            loading: "Revoking...",
            success: "Invitation revoked successfully!",
          });
        });
      }}
    >
      <BasicButton style={{ backgroundColor: "#DC676C" }}>
        Revoke Invitation
      </BasicButton>
    </div>
  );
};

export default RevokeUserCell;
