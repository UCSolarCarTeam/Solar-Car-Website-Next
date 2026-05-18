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
