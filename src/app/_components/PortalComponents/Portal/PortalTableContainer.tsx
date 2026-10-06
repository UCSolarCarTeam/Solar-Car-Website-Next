import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function PortalTableContainer({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-full overflow-x-auto overflow-y-hidden rounded-xl border border-slate-200 bg-white [-webkit-overflow-scrolling:touch]",
        "[&_table]:w-max [&_table]:min-w-full [&_table]:border-collapse [&_table]:border-spacing-0 [&_table]:bg-white [&_table]:text-sm [&_table]:leading-5",
        "[&_thead]:bg-slate-100 [&_thead]:text-left [&_th]:px-4 [&_th]:py-2 [&_th]:text-sm [&_th]:font-semibold [&_th]:whitespace-nowrap [&_th]:text-[#1f2937]",
        "[&_tbody_tr]:h-22 [&_tbody_tr:hover]:bg-slate-50 [&_tbody_tr:last-child]:border-b-0",
        "[&_td]:relative [&_td]:max-w-[40ch] [&_td]:px-4 [&_td]:py-2 [&_td]:wrap-break-word [&_td]:whitespace-normal [&_td]:text-[#374151]",
        "[&_td.font-medium]:font-medium [&_td.font-medium]:text-[#1f2937] [&_tr]:border-b [&_tr]:border-slate-200",
        "[@media(max-width:768px)]:[&_table]:text-[0.8125rem] [@media(max-width:768px)]:[&_th]:px-3 [@media(max-width:768px)]:[&_td]:px-3",
        // The narrow rules need to win over the overlapping tablet query.
        "[@media(max-width:320px)]:[&&]:[&_table]:text-xs [@media(max-width:320px)]:[&&]:[&_th]:px-[0.6rem] [@media(max-width:320px)]:[&&]:[&_th]:py-[0.4rem] [@media(max-width:320px)]:[&&]:[&_td]:px-[0.6rem] [@media(max-width:320px)]:[&&]:[&_td]:py-[0.4rem]",
      )}
    >
      {children}
    </div>
  );
}
