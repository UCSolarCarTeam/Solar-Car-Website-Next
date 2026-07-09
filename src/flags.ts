import { vercelAdapter } from "@flags-sdk/vercel";
import { flag } from "flags/next";

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
