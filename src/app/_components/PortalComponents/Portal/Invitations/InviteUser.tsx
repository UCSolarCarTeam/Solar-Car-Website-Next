import { memo, useState } from "react";
import { toast } from "react-hot-toast";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import SearchBar from "@/app/_components/PortalComponents/SearchBar";
import { allClerkRoles } from "@/app/_types";
import { type UserRole } from "@/server/api/routers/portal";
import { trpc } from "@/trpc/react";

import styles from "../index.module.scss";

const InviteUser = () => {
  const [email, setEmail] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(allClerkRoles[0]);

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

    inviteUserMutation.mutate({ email, selectedRole });
  };

  return (
    <div className={styles.inviteUserFormContainer}>
      <SearchBar
        placeholder="Enter email"
        setSearchValue={setEmail}
        value={email}
      />
      <select
        className={styles.userRoleSelect}
        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
        value={selectedRole}
      >
        {allClerkRoles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
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
