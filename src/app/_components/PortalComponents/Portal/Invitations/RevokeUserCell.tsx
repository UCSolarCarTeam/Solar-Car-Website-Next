import { memo } from "react";
import toast from "react-hot-toast";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import styles from "@/app/_components/PortalComponents/DeleteClerkUserCell/index.module.scss";
import { trpc } from "@/trpc/react";

export interface RevokeUserInvitationProps {
  invitationId: string;
}

const RevokeUserCell = ({ invitationId }: RevokeUserInvitationProps) => {
  const utils = trpc.useUtils();
  const revokeInvitation = trpc.portal.revokeUserInvitation.useMutation({
    onError: () => {
      toast.error(
        "There was an error revoking the user's invitation. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getInvitedUsers.invalidate(), {
        loading: "Revoking...",
        success: "Invitation revoked successfully!",
      });
    },
  });
  return (
    <div
      className={styles.deleteClerkUserCell}
      onClick={(e) => {
        e.stopPropagation();
        revokeInvitation.mutate({ invitationId: invitationId });
      }}
    >
      <BasicButton style={{ backgroundColor: "#DC676C" }}>
        Revoke Invitation
      </BasicButton>
    </div>
  );
};

export default memo(RevokeUserCell);
