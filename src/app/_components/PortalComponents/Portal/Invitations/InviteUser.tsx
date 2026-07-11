import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import Select from "react-select";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import SearchBar from "@/app/_components/PortalComponents/SearchBar";
import { runPortalAction } from "@/app/portal/_lib/runAction";
import { inviteUser as inviteUserAction } from "@/app/portal/actions";
import type { UserRole } from "@/server/portal/types";

import { portal } from "@/lib/portal-classes";

const ROLE_OPTIONS = [
  { label: "Member", value: "member" },
  { label: "Admin", value: "admin" },
  { label: "Business", value: "business" },
  { label: "Mechanical Lead", value: "mechanicallead" },
  { label: "Electrical Lead", value: "electricallead" },
];

const InviteUser = () => {
  const [email, setEmail] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState(ROLE_OPTIONS[0]);
  const [isPending, startTransition] = useTransition();

  const inviteUser = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValidEmail = emailRegex.test(email);

    if (!isValidEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!selectedRole) {
      toast.error("Please select a role.");
      return;
    }

    startTransition(() => {
      void runPortalAction(
        () =>
          inviteUserAction({
            email,
            selectedRole: selectedRole.value as UserRole,
          }),
        {
          error: "Failed to invite user.",
          loading: "Inviting...",
          success: "User invited successfully!",
        },
      );
    });
  };

  return (
    <div className={portal.inviteUserFormContainer}>
      <SearchBar
        placeholder="Enter email"
        setSearchValue={setEmail}
        value={email}
      />
      <Select
        instanceId="portal-invite-user-role"
        isClearable={false}
        isDisabled={email.length === 0}
        isSearchable={false}
        onChange={(option) => {
          if (option) {
            setSelectedRole(option);
          }
        }}
        options={ROLE_OPTIONS}
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
      <BasicButton disabled={isPending || !email.trim()} onClick={inviteUser}>
        {isPending ? "Inviting..." : "Invite"}
      </BasicButton>
    </div>
  );
};

export default InviteUser;
