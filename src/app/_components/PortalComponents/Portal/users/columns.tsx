import Image from "next/image";
import defaultProfilePictureSquare from "public/assets/DefaultProfilePicture-Square.png";
import Select from "react-select";

import { ClerkUser } from "@/app/_hooks/useUser";
import { adminClerkRoles } from "@/app/_types";
import { AdminRoles, UserRole } from "@/server/api/routers/portal";
import { CellContext, createColumnHelper } from "@tanstack/react-table";

import DeleteClerkUserCell from "../../DeleteClerkUserCell";
import { User } from "../UsersTable";

const dropdownOptions = [
  { label: "Admin", value: "admin" },
  { label: "Business", value: "business" },
  { label: "Mechanical Lead", value: "mechanicallead" },
  { label: "Electrical Lead", value: "electricallead" },
  { label: "Member", value: "member" },
] as const;
const columnHelper = createColumnHelper<User>();
export const columns = (
  clerkUser: ClerkUser | undefined,
  handleChange: (userId: string, role: UserRole) => void,
) => [
  columnHelper.accessor("imageUrl", {
    cell: (info) => (
      <Image
        alt="profile image"
        height={64}
        loading="eager"
        priority
        src={info.getValue() ?? defaultProfilePictureSquare}
        width={64}
      />
    ),
    header: () => null,
  }),
  columnHelper.accessor("username", {
    cell: (info) => info.getValue(),
    header: "Username",
  }),
  columnHelper.accessor("firstName", {
    cell: (info) => info.getValue(),
    header: "First Name",
  }),
  columnHelper.accessor("lastName", {
    cell: (info) => info.getValue(),
    header: "Last Name",
  }),
  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: "Email",
  }),
  columnHelper.accessor("role", {
    cell: (info) => (
      <Select
        isDisabled={
          !adminClerkRoles.includes(
            (clerkUser?.publicMetadata.role as AdminRoles) ?? "",
          ) || info.row.original.id === clerkUser?.id
        }
        onChange={(option) => {
          if (option) {
            handleChange(info.row.original.id, option.value as UserRole);
          }
        }}
        options={dropdownOptions}
        value={
          dropdownOptions.find(
            (option) => option.value === info.getValue(),
          ) ?? { label: "Unverified", value: "Unverified" }
        }
      />
    ),
    header: "Role",
  }),
  columnHelper.display({
    cell: (info) => {
      return <DeleteClerkUserCell clerkId={info.row.original.id} />;
    },
    header: () => null,
    id: "delete",
  }),
];
