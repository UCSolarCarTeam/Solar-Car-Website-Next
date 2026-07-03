import { flag } from "flags/next";

import { vercelAdapter } from "@flags-sdk/vercel";

export const recruitmentOpen = flag<boolean>({
  adapter: vercelAdapter(),
  defaultValue: false,
  description: "Controls whether recruitment applications are open.",
  key: "recruitment-open",
  options: [
    { label: "Closed", value: false },
    { label: "Open", value: true },
  ],
});

export const ourWorkOpen = flag<boolean>({
  adapter: vercelAdapter(),
  defaultValue: false,
  description: "Controls whether the our-work page is available.",
  key: "our-work-open",
  options: [
    { label: "Closed", value: false },
    { label: "Open", value: true },
  ],
});
