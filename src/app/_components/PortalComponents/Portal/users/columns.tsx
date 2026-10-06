import { createColumnHelper } from "@tanstack/react-table";
import type { ClerkUser } from "@/app/_hooks/useUser";
import { adminClerkRoles } from "@/app/_types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminRoles, UserRole } from "@/server/portal/types";

import DeleteClerkUserCell from "../../DeleteClerkUserCell";
import PortalAvatar from "../PortalAvatar";
import type { User } from "./UsersTable";

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
      <PortalAvatar
        alt={`Profile picture of ${[info.row.original.firstName, info.row.original.lastName].filter(Boolean).join(" ") || info.row.original.username || "portal user"}`}
        src={info.getValue()}
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
        disabled={
          !adminClerkRoles.includes(
            (clerkUser?.publicMetadata.role as AdminRoles) ?? "",
          ) || info.row.original.id === clerkUser?.id
        }
        onValueChange={(role) =>
          handleChange(info.row.original.id, role as UserRole)
        }
        value={
          dropdownOptions.find((option) => option.value === info.getValue())
            ?.value ?? ""
        }
      >
        <SelectTrigger
          aria-label={`Account role for ${[info.row.original.firstName, info.row.original.lastName].filter(Boolean).join(" ") || info.row.original.username || "portal user"}`}
          className="w-full min-w-48 rounded-md border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 data-[size=default]:h-9"
          id={`portal-user-role-${info.row.original.id}`}
        >
          <SelectValue placeholder="Unverified" />
        </SelectTrigger>
        <SelectContent
          align="start"
          className="z-110 max-h-[min(20rem,var(--radix-select-content-available-height))] w-(--radix-select-trigger-width) max-w-(--radix-select-content-available-width) bg-white text-gray-700"
          collisionPadding={8}
          data-lenis-prevent=""
          position="popper"
        >
          <SelectGroup>
            {dropdownOptions.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    header: "Role",
  }),
  columnHelper.display({
    cell: (info) => {
      return <DeleteClerkUserCell clerkId={info.row.original.id} />;
    },
    enableHiding: false,
    header: () => null,
    id: "delete",
  }),
];
