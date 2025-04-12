import { memo } from "react";
import toast from "react-hot-toast";

import styles from "@/app/_components/PortalComponents/DeleteClerkUserCell/index.module.scss";
import { trpc } from "@/trpc/react";

import BasicButton from "../../Buttons/BasicButton";

export interface DeleteClerkUserProps {
  clerkId: string;
}

const DeleteClerkUser = ({ clerkId }: DeleteClerkUserProps) => {
  const utils = trpc.useUtils();
  const deleteUser = trpc.portal.deleteClerkUser.useMutation({
    onError: () => {
      toast.error(
        "There was an error deleting the clerk user. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getSponsorsList.invalidate(), {
        loading: "Deleting...",
        success: "Clerk user deleted successfully!",
      });
    },
  });
  return (
    <div
      className={styles.deleteClerkUserCell}
      onClick={(e) => {
        e.stopPropagation();
        deleteUser.mutate({ clerkId: clerkId });
      }}
    >
      <BasicButton style={{ backgroundColor: "#DC676C" }}>Delete</BasicButton>
    </div>
  );
};

export default memo(DeleteClerkUser);
