import { memo, useState } from "react";
import { toast } from "react-hot-toast";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import SearchBar from "@/app/_components/PortalComponents/SearchBar";
import { trpc } from "@/trpc/react";

import styles from "../index.module.scss";

const InviteUser = () => {
  const [email, setEmail] = useState<string>("");

  const utils = trpc.useUtils();
  const inviteUserMutation = trpc.portal.inviteUser.useMutation({
    onError: () => {
      toast.error(
        "There was an error inviting the user. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getInvitedUsers.invalidate(), {
        loading: "Inviting...",
        success: "User invited successfully!",
      });
    },
  });

  const inviteUser = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValidEmail = emailRegex.test(email);

    if (!isValidEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    inviteUserMutation.mutate({ email });
  };

  return (
    <div className={styles.inviteUserFormContainer}>
      <SearchBar
        placeholder="Enter email"
        setSearchValue={setEmail}
        value={email}
      />
      <BasicButton
        disabled={inviteUserMutation.isPending || !email.trim()}
        onClick={inviteUser}
      >
        {inviteUserMutation.isPending ? "Inviting..." : "Invite"}
      </BasicButton>
    </div>
  );
};

export default memo(InviteUser);
