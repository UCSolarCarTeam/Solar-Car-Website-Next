"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamRoleSelectProps {
  id: string;
  name: string;
  value: string | null;
  groups: { label: string; options: Record<string, string> }[];
  onValueChange: (value: string) => void;
  error?: string;
}

// Radix reserves the empty string for clearing the selected value.
const NO_ROLE_VALUE = "__none__";

export default function TeamRoleSelect({
  id,
  name,
  value,
  groups,
  onValueChange,
  error,
}: TeamRoleSelectProps) {
  return (
    <Select
      name={name}
      onValueChange={(nextValue) =>
        onValueChange(nextValue === NO_ROLE_VALUE ? "" : nextValue)
      }
      value={value || NO_ROLE_VALUE}
    >
      <SelectTrigger
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className="mt-1 w-full min-w-0 rounded-md border-gray-300 bg-white px-2 text-gray-600 shadow-sm data-[size=default]:h-9"
        id={id}
      >
        <SelectValue placeholder="Please select" />
      </SelectTrigger>
      <SelectContent
        align="start"
        className="z-110 max-h-[min(20rem,var(--radix-select-content-available-height))] w-(--radix-select-trigger-width) max-w-(--radix-select-content-available-width) bg-white text-gray-700"
        collisionPadding={8}
        position="popper"
      >
        <SelectGroup>
          <SelectItem value={NO_ROLE_VALUE}>Please select</SelectItem>
        </SelectGroup>
        {groups.map(({ label, options }) => (
          <SelectGroup key={label}>
            <SelectLabel>{label}</SelectLabel>
            {Object.entries(options).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
