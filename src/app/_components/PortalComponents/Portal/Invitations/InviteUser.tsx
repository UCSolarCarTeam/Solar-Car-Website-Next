import { memo, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Select from "react-select";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import SearchBar from "@/app/_components/PortalComponents/SearchBar";
import { type UserRole } from "@/server/api/routers/portal";
import { trpc } from "@/trpc/react";

import styles from "../index.module.scss";

const InviteUser = () => {
  const [email, setEmail] = useState<string>("");

  const dropdownOptions = useMemo(
    () => [
      { label: "Member", value: "member" },
      { label: "Admin", value: "admin" },
      { label: "Business", value: "business" },
      { label: "Mechanical Lead", value: "mechanicallead" },
      { label: "Electrical Lead", value: "electricallead" },
    ],
    [],
  );
  const [selectedRole, setSelectedRole] = useState(dropdownOptions[0]);

  const utils = trpc.useUtils();
  const inviteUserMutation = trpc.portal.inviteUser.useMutation({
    onError: (error) => {
      toast.error("Failed to invite user: " + error.message);
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

    // this is a redundant check because you can't clear the select
    // but react-select complain unless you put it here so
    if (!selectedRole) {
      toast.error("Please select a role.");
      return;
    }

    inviteUserMutation.mutate({
      email,
      selectedRole: selectedRole.value as UserRole,
    });
  };

  return (
    <div className={styles.inviteUserFormContainer}>
      <SearchBar
        placeholder="Enter email"
        setSearchValue={setEmail}
        value={email}
      />
      <Select
        isClearable={false}
        isDisabled={email.length === 0 ? true : false}
        isSearchable={false}
        onChange={(option) => {
          if (option) {
            setSelectedRole(option);
          }
        }}
        options={dropdownOptions}
        // if we dont want inline styles we can change this to
        // classnames but have to look at docs
        styles={{
          control: (provided) => ({
            ...provided,
            fontSize: "14px",
            fontWeight: "normal",
          }),
          option: (provided) => ({
            ...provided,
            fontSize: "14px",
            fontWeight: "normal",
          }),
          singleValue: (provided) => ({
            ...provided,
            fontSize: "14px",
            fontWeight: "normal",
          }),
        }}
        value={selectedRole}
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
